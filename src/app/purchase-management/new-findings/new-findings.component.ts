import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AddNewFindingsComponent } from './add-new-findings/add-new-findings.component';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { CostPredictionComponent } from '../cost-prediction/cost-prediction.component';
@Component({
  selector: 'app-new-findings',
  templateUrl: './new-findings.component.html',
  styleUrls: ['./new-findings.component.scss'],
})
export class NewFindingsComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public share: ShareService,
    private api: ApiService,
    private commonMethod: CommonMethodService,
    private route: Router,
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.newFindingList = [];
    this.getTractorList();
  }
  refreshList() {
    this.getTractorList();
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
      component: AddNewFindingsComponent,
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
      component: AddNewFindingsComponent,
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
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      type:this.selectedItem
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingList', obj).subscribe(
      (res: any) => {
        this.newFindingList = res.data;
        this.newFindingList.forEach((tract: any) => {
          tract.name = tract?.modelDetails?.name;
        });
        this.filterData(  this.newFindingList)
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  holddingList:any=[]
  filterData(filteredList:any){
      this.allFilterList=filteredList
    if(filteredList?.length>30){
 this.newFindingList=filteredList.slice(0, 30);
 this.holddingList= filteredList.slice(30,filteredList?.length);
  
    }else{
    this.newFindingList=filteredList
     this.holddingList=[]
    }

  }
   optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    this.getTractorList();
  }
    expandListEvent(){
  //  this.share.showLoading("Rendering Data...")
  this.share.presentToast("Expanding...")
  setTimeout(() => {
      if(this.newFindingList?.length<this.allFilterList?.length){
  this.newFindingList = [...this.newFindingList, ...this.holddingList]
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
    registractionNo: null,
  };

  buttonArray: any = [
    {
      name: 'Finding Edit',
      action: 'FindingEdit',
      image: './././assets/images/edit.png',
    },

    {
      name: 'Upload New FInding Image',
      action: 'uploadNewFiningImage',
      image: './././assets/images/all_image_icon.png',
    },
        {
      name: 'New Finding Cost Estimation',
      action: 'newFindingCostEstimation',
      image: './././assets/images/rupee-sign.png',
    },
      {
      name: 'View New Finding Deals',
      action: 'viewNewFindingDeals',
      image: './././assets/images/visual.png',
    },
         {
      name: 'New Finding Action',
      action: 'newFindingAction',
      image: './././assets/images/contract.png',
    },
  ];
  keyList: any = [
        { key: 'Purchase Number', value: 'purchaseSrNo', type: 'INPUT' },
    {
      key: 'Year Of Manufactoring',
      value: 'yearOfManufactoring',
      type: 'INPUT',
    },
    { key: 'Registration Number', value: 'registractionNo', type: 'INPUT' },
    { key: 'Delear', value: 'name', getFromObj: true,
      objName: 'delearDetails', type: 'INPUT' },
        { key: 'Contact', value: 'contactNo', getFromObj: true,
      objName: 'delearDetails', type: 'INPUT' },
             { key: 'Location', value: 'location', getFromObj: true,
      objName: 'delearDetails', type: 'INPUT' },
    { key: 'Quote Delear', value: 'quoteByDealer', type: 'INPUT' },
    { key: 'Quote By TF', value: 'quoteByTf', type: 'INPUT' },
    { key: 'Final Price', value: 'finalPrice', type: 'INPUT' },

    { key: 'Hours', value: 'hours', type: 'INPUT' },

    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  actionEventHeader(e: any) {
    if (e?.name == 'Search') {
      this.searchTractor();
    } else if (e?.name == 'Filter') {
      this.openFilter();
    } else if (e?.name == 'Add') {
      this.showModal();
    }
    else if (e?.name == 'Cost Prediction') {
      this.openCostPrediction();
    }
    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }
  }
  searchTractor() {}
  openFilter() {}
  headerDisplayArray = [
    { name: 'Search', icon: 'search-outline' },

    { name: 'Add', icon: 'add-circle-outline' },
    { name: 'Cost Prediction', icon: 'cash-outline' },
    { name: 'Filter', icon: 'cog-outline' },
  ];
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
  selectedBrand: any;
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
    selectedItem = 'OPEN';
  optionsArray: any = [
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
    }
  ];
}
