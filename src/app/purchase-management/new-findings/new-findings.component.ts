import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AddNewFindingsComponent } from './add-new-findings/add-new-findings.component';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { CostPredictionComponent } from '../cost-prediction/cost-prediction.component';
import { FindingFilterComponent } from 'src/app/shared-components/finding-filter/finding-filter.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-findings',
  templateUrl: './new-findings.component.html',
  styleUrls: ['./new-findings.component.scss'],
    providers: [DatePipe],
})
export class NewFindingsComponent implements OnInit {
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
       this.selectedItem = 'OPEN'
    this.resetFilterVal()
        this.getBrandList();
    this.getTractorList();
    this.getOldTractorList()

    console.log("Deal",this.deal);
    
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
      component: AddNewFindingsComponent,
      componentProps: {
        data: dataUpdate,
        deal:this.deal

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
  deal:any
  staffDetails: any;
  newFindingList: any = [];
  newFindingListSrc: any = [];
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      type:this.selectedItem,
      deal_id:this.deal?.id
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingList', obj).subscribe(
      (res: any) => {
        this.newFindingList = res.data;
        this.newFindingListSrc = res.data;
        this.newFindingList.forEach((tract: any) => {
          tract.name = tract?.modelDetails?.name;
        });
             this.newFindingList=this.newFindingList.reverse()
             this.filterActiveAndFilterBy()
      //  this.filterData(  this.newFindingList)
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  oldFindingList:any=[]
    getOldTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
    
      dealerId:this.deal?.dealerId
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingListOld', obj).subscribe(
      (res: any) => {
        this.oldFindingList = res.data;
      
        this.oldFindingList.forEach((tract: any) => {
            let formattedDate = this.datePipe.transform(
            new Date(tract?.createdOn),
            'dd-MM-yyyy',
          );
          tract.name = tract?.modelDetails?.name+'-'+tract?.delearDetails?.name+'-'+formattedDate;
        });
             this.oldFindingList=this.oldFindingList.reverse()
       
      //  this.filterData(  this.newFindingList)
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
      this.hadAction=true
    }

    console.log('actionEventCall', e);
  }
  hadAction=false
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
      {
      name: 'Delete New Findings',
      action: 'DeleteNewFindings',
      image: './././assets/images/deleted.png',
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
    { key: 'Selling Estimation', value: 'selling_estimation', type: 'INPUT' },
    { key: 'Is NOC', value: 'isNoc', type: 'INPUT' },

    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  actionEventHeader(e: any) {
    if (e?.name == 'Search') {
      this.searchTractor();
    } else if (e?.name == 'Filter') {
      this.openFilterNew  ();
    } else if (e?.name == 'Add') {
      this.showModal();
    }
    else if (e?.name == 'Add Old') {
      this.selectItem(this.oldFindingList,'name','old_find');
    }
    else if (e?.name == 'Cost Prediction') {
      this.openCostPrediction();
    }
       else if (e?.name == 'Close') {
      this.modalCtrl.dismiss(this.hadAction);
    }
    
    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }
  }
  searchTractor() {}
  openFilter() {}
  headerDisplayArray = [
        { name: 'Add', icon: 'add-circle-outline' },
    
  { name: 'Close', icon: 'close-circle' },
{ name: 'Filter', icon: 'cog-outline' },
        { name: 'Add Old', icon: 'briefcase-outline' },

  

  ];
    async selectItem(list: any, itemName: any, table_name: any) {
      const modal = await this.modalCtrl.create({
        component: SelectWithSearchComponent,
        componentProps: {
          list: list,
          itemName: itemName,
          table_name: table_name,
          showAddButton: false,
          otherObjects: null,
          jsonKey: 'name',
          search: {
            name: null,
          },
        },
      });
      await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
  
      if (data) {
        console.log("data",data);
        
        //   this.newFindingForms.controls['dealerId'].setValue(data?.id);
       this.updateDealInNewFindings(data)
  
        //this.resetOtherValue()
      }
  
    
  
      if (role === 'confirm') {
      }
    }
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
    updateDealInNewFindings(new_finding:any) {
   let objData={
    deal_id:this.deal?.id,
    dealerId:this.deal?.dealerId
   }
      let obj = {
        src: 'new_findings',
        data: objData,
        id:new_finding?.id
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Updated Successfully');
        this.getTractorList()
        this.getOldTractorList()
        this.share.spinner.dismiss();
    
      });

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
    if (!this.checkedAll) {
      // filteredList = this.share.filterByBrand(
      //   this.allTractorsSrcList,
      //   this.selectedBrand
      // );
      filteredList = this.share.filterByBrandFindings(tractorList, this.selectedBrand);
    } else {
      filteredList = JSON.parse(JSON.stringify(tractorList));
    }

    filteredList = this.share.filterByManuYear(filteredList, this.yearChecked);
    this.allFilterList = filteredList;
    if (filteredList?.length > 30) {
      this.newFindingList = filteredList.slice(0, 30);
      this.holddingList = filteredList.slice(30, filteredList?.length);
    } else {
      this.newFindingList = filteredList;
      this.holddingList = [];
    }

    //console.log("this.holddingList",this.holddingList,'this.alltractorList',this.alltractorList);

    //this.alltractorList = filteredList;

    // if (this.alltractorList?.length > 50) {
    //   this.alltractorList=this.alltractorList.splice(50)

    // }else{
    //   this.share.spinner.dismiss()
    // }
    this.holddingList?.forEach((tractor: any) => {
      this.share.getImagesToShow(tractor);
    });
  }
  selectedBrand: any=null;
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
