import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AddNewDealComponent } from './add-new-deal/add-new-deal.component';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { CostPredictionComponent } from '../cost-prediction/cost-prediction.component';
import { FindingFilterComponent } from 'src/app/shared-components/finding-filter/finding-filter.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-findings-deals',
  templateUrl: './new-findings-deals.component.html',
  styleUrls: ['./new-findings-deals.component.scss'],
  providers: [DatePipe],
})
export class NewFindingsDealsComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public share: ShareService,
    private api: ApiService,
    private commonMethod: CommonMethodService,
    private route: Router,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.newFindingList = [];
    this.selectedItem = 'OPEN';
    this.resetFilterVal();
    this.getBrandList();
    this.getTractorList();
  }
  refreshList() {
    this.getTractorList();
  }
  yearChecked = 'ALL';
  checkedAll = true;

  resetFilterVal() {
    this.checkedAll = true;
    this.selectedBrand = [];
    this.allFilterList = [];

    this.yearChecked = 'ALL';
  }
  addNewFinding() {}
  tractorListStorewise(e: any) {}

  async viewImage(new_finding: any) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: new_finding?.id,
        imageGroup: 'NEW_FINDING',
        uploadPhoto: true,
        apiName: 'saveNewFindingImage',
        getApiName: 'getNewFindingImages',
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async showModal(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddNewDealComponent,
      componentProps: {
        data: dataUpdate,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.getTractorList();
    }
  }
  async openCostPrediction(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: CostPredictionComponent,
      componentProps: {
        data: dataUpdate,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.getTractorList();
    }
  }
  async viewData(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddNewDealComponent,
      componentProps: {
        data: dataUpdate,
        isShowOnly: true,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      // this.getTractorList()
    }
  }
  staffDetails: any;
  newFindingList: any = [];
  newFindingListSrc: any = [];
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingDealsList', obj).subscribe(
      (res: any) => {
        this.newFindingList = res.data;
        this.newFindingListSrc = res.data;
        this.newFindingList?.forEach((f: any) => {
          let formattedDate = this.datePipe.transform(
            new Date(f?.deal_date),
            'dd-MM-yyyy',
          );
          f.name = f.dealerName + '-' + formattedDate;
          f.tractorsCount=f?.tractorsInDeal?.length;
          f.haveNoc=f?.tractorsInDeal?.filter((trF:any)=>trF.isNoc=='YES')?.length
          let totalCosting=0
          let totalSellingEstimation=0
          f?.tractorsInDeal?.forEach((trF:any)=>{
totalCosting=totalCosting+Number(trF?.finalPrice)
totalSellingEstimation=totalSellingEstimation+Number(trF?.selling_estimation)
          })
          f.totalCosting=totalCosting
          f.totalSellingEstimation=totalSellingEstimation
          f.profitEstimation=f.totalSellingEstimation-f.totalCosting
        f.inDiscussion=f?.tractorsInDeal?.filter((trF:any)=>trF.approved_status=='OPEN')?.length
        f.approved=f?.tractorsInDeal?.filter((trF:any)=>trF.approved_status=='APPROVED')?.length
        f.rejected=f?.tractorsInDeal?.filter((trF:any)=>trF.approved_status=='REJECTED')?.length
        f.calculationIn=f?.tractorsInDeal?.filter((tractorF:any)=>Number(tractorF?.finalPrice)>0 && Number(tractorF?.selling_estimation) > 0)?.length + ' Out Of ' +f?.tractorsCount
        f.averageProfit=Number((f.profitEstimation/Number(f?.tractorsCount)).toFixed(2))
        });
        this.newFindingListSrc?.forEach((f: any) => {
          let formattedDate = this.datePipe.transform(
            new Date(f?.deal_date),
            'dd-MM-yyyy',
          );
          f.name = f.dealerName + '-' + formattedDate;
        });
        this.share.globalLoading = false;
        // this.newFindingList=this.newFindingList.reverse()
        this.filterActiveAndFilterBy();
        // this.filterData(  this.newFindingList)
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  holddingList: any = [];
  filterData(filteredList: any) {
    this.allFilterList = filteredList;
    if (filteredList?.length > 1) {
      this.newFindingList = filteredList.slice(0, 1);
      this.holddingList = filteredList.slice(1, filteredList?.length);
    } else {
      this.newFindingList = filteredList;
      this.holddingList = [];
    }
    console.log('this.newFindingList', this.newFindingList);
  }
  optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    this.getTractorList();
  }
  expandListEvent() {
    //  this.share.showLoading("Rendering Data...")
    this.share.presentToast('Expanding...');
    setTimeout(() => {
      if (this.newFindingList?.length < this.allFilterList?.length) {
        this.newFindingList = [...this.newFindingList, ...this.holddingList];
      }
    }, 0);

    setTimeout(() => {
      //this.share.spinner.dismiss()
    }, 0);
  }
  openEdit(tractor: any, ind: any) {
    this.showModal(tractor);
  }
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });

    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }

    console.log('actionEventCall', e);
  }
  listColorClass = 'secondColor';
  search = {
    name: null,
  };

  buttonArray: any = [
    {
      name: 'New Finding Deals Edit',
      action: 'NewFindingDealsEdit',
      image: './././assets/images/edit.png',
    },

    
     {
      name: 'Deals Tractor List',
      action: 'dealsTractorList',
      image: './././assets/images/tractorsuccess.png',
    },

  ];
  keyList: any = [

    { key: 'Deal Date', value: 'deal_date', type: 'INPUT' },
    { key: 'Tractors', value: 'tractorsCount', type: 'INPUT' },
    { key: 'Deal Open', value: 'inDiscussion', type: 'INPUT' },
    { key: 'APPROVED', value: 'approved', type: 'INPUT' },
    { key: 'REJECTED', value: 'rejected', type: 'INPUT' },
    { key: 'Purchase Cost', value: 'totalCosting', type: 'INPUT' },
    { key: 'Selling Estimation', value: 'totalSellingEstimation', type: 'INPUT' },
    { key: 'Profit Estimation', value: 'profitEstimation', type: 'INPUT' },
    { key: 'Average Profit', value: 'averageProfit', type: 'INPUT' },
    { key: 'Calculated In', value: 'calculationIn', type: 'INPUT' },
  

    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  actionEventHeader(e: any) {
    if (e?.name == 'Search') {
      this.searchTractor();
    } else if (e?.name == 'Filter') {
      this.openFilterNew();
    } else if (e?.name == 'Add') {
      this.showModal();
    } else if (e?.name == 'Cost Prediction') {
      this.openCostPrediction();
    }
    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }
  }
  searchTractor() {}
  openFilter() {}
  headerDisplayArray = [{ name: 'Add', icon: 'add-circle-outline' }];
  allFilterList: any = [];
  brandList: any = [];
  getBrandList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('brand', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.brandList = res?.data;
          this.brandList = this.brandList.reverse();

          // console.log('  this.brandList', this.brandList);
          // if (!loader) {
          //   this.selectedBrand = this.brandList[0]?.id;

          // }
        },
        (error: any) => {},
      );
    }, 0);
  }
  async openFilterNew() {
    const modal = await this.modalCtrl.create({
      component: FindingFilterComponent,
      componentProps: {
        listColorClass: this.listColorClass,
        optionsArray: [],
        selectedBrand: this.selectedBrand,
        checkedAll: this.checkedAll,

        yearChecked: this.yearChecked,
        brandList: this.brandList,
      },
      cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data) {
      this.selectedBrand = data?.selectedBrand;
      this.checkedAll = data?.checkedAll;

      this.yearChecked = data?.yearChecked;

      this.filterActiveAndFilterBy();
    }
  }
  filterActiveAndFilterBy() {
    this.share.showLoading('Rendering Data', 2000);
    //this.newFindingList = [];
    setTimeout(() => {
      let tractorList: any = [];
      tractorList = this.newFindingListSrc;

      this.sortByFilter(tractorList);
    }, 0);
  }
  sortByFilter(tractorList: any) {
    let filteredList = [];

    filteredList = JSON.parse(JSON.stringify(tractorList));

    this.allFilterList = filteredList;
    if (filteredList?.length > 30) {
      this.newFindingList = filteredList.slice(0, 30);
      this.holddingList = filteredList.slice(30, filteredList?.length);
    } else {
      this.newFindingList = filteredList;
      this.holddingList = [];
    }
  }
  selectedBrand: any = null;
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
  selectedItem = 'OPEN';
  optionsArray: any = [
     {
      id: 'ALL',
      name: 'All',
    },
    {
      id: 'OPEN',
      name: 'Open',
    },
    {
      id: 'APPROVED',
      name: 'Approved',
    },
    {
      id: 'REJECTED',
      name: 'Rejected',
    },
  ];
}
