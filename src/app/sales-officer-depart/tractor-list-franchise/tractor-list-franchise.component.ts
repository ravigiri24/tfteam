import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { GlobalFilterTractorComponent } from 'src/app/shared-components/global-filter-tractor/global-filter-tractor.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { NotificationPopUpComponent } from 'src/app/shared-components/notification-pop-up/notification-pop-up.component';
import { RequestApproveFormComponent } from './request-approve-form/request-approve-form.component';
import { ViewAppovalsListComponent } from 'src/app/shared-components/view-appovals-list/view-appovals-list.component';
@Component({
  selector: 'app-tractor-list-franchise',
  templateUrl: './tractor-list-franchise.component.html',
  styleUrls: ['./tractor-list-franchise.component.scss'],
})
export class TractorListFranchiseComponent implements OnInit {
  constructor(
    public share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private commonMethod:CommonMethodService
  ) {}
  lower = 0;
  upper = 0;
  yearChecked = 'ALL';
  wheeldrive = 'ALL';
  ionViewWillEnter() {
        let staffDetails: any = this.share.get_staff();
    this.allFilterList=[]

    this.staffDetails = JSON.parse(staffDetails);
     this.headerDisplayArray=JSON.parse(JSON.stringify(this.headerDisplayArraySrc))
    // this.checkedAll = true;
    // this.selectedBrand = [];
    // this.lower = 0;
    // this.listBy='ACTIVE'
    // this.filterBy='NOT_SOLD'
    // this.upper = 1500000;
    // this.yearChecked = 'ALL';
      let obj: any = this.share.getStaffObj();
   obj.staff_id=this.staffDetails?.id
 this.api.checkNotification(obj)
  this.resetFilterVal()
    this.getBrandList();
    this.getWareHouseList();

    // this.getTractorList();
  }
  resetFilterVal(){
       this.checkedAll = true;
    this.selectedBrand = [];
    this.lower = 0;
    this.listBy='ACTIVE'
    this.filterBy='NOT_SOLD'
    this.upper = 1500000;
    this.yearChecked = 'ALL';
    this.wheeldrive = 'ALL';
  }
  brandList: any = [];
  selectedBrand: any = [];
  getBrandList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    // this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('brand', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.brandList = res?.data;
          this.brandList = this.brandList.reverse();

          console.log('  this.brandList', this.brandList);
        },
        (error: any) => {}
      );
    }, 0);
  }
  ngOnInit() {}
  staffDetails: any;
  listColorClass = 'firstColor';
  warehouseList: any = [];
  selectedStore: any;
  allotedWareHouse:any=[]
  getWareHouseList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    // this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;
    this.share.showLoading('Loading...');
    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();
          this.share.putUnAssignedInWareHouse(this.warehouseList )
              this.share.putAllInWareHouse(this.warehouseList )

     let allotedStore = this.staffDetails?.allotedStore;
      let warehouseList:any=[]
      this.warehouseList?.forEach((ware: any) => {
        let checkIn = allotedStore?.find(
          (store: any) => store.store_id == ware?.id
        );
        if (checkIn) {
          let findI = this.warehouseList?.findIndex(
            (wareIn: any) => wareIn?.id == ware?.id
          );
          warehouseList.push(ware)
       
        }
      });
      this.allotedWareHouse=warehouseList


          console.log('this.warehouseList', this.warehouseList);
          if (!loader) {
            if(this.allotedWareHouse?.length){
            // this.selectedStore = this.allotedWareHouse[0]?.id;
                  let selectedStore: any = this.share.get_sales_officer_store();
            this.selectedStore = JSON.parse(selectedStore)?.store_id;
            }else{
                this.selectedStore = this.warehouseList[2]?.id;
            }
            this.getAllTractorListStorewise();
            //this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
 
  checkOwnstore(){
    let check=this.allotedWareHouse?.find((f:any)=>f.id==this.selectedStore)
    if(check){
      this.buttonArray=this.buttonArrayCore
    }else{
      this.buttonArray=[
        {
      name: 'View Refurbish Details',
      action: 'viewRefurbishDetails',
      image: './././assets/images/layout.png',
    },
         {
      name: 'View Tractor All Images',
      action: 'viewTractorAllImage',
      image: './././assets/images/all_image_icon.png',
    },
      ]
    }
  }
    buttonArrayCore: any = [
  
     {
      name: 'Upload Recive Tractor Image',
      action: 'reciveTractorImage',
      image: './././assets/images/image_upload.png',
    },
      {
     name: 'Approval Request',
      action: 'approvalRequest',
      image: './././assets/images/request.png',
    }, 
         {
      name: 'View Tractor All Images',
      action: 'viewTractorAllImage',
      image: './././assets/images/all_image_icon.png',
    },
     {
      name: 'View Refurbish Details',
      action: 'viewRefurbishDetails',
      image: './././assets/images/layout.png',
    }
   
  ];
  headerDisplayArray = [
    { name: 'Search', icon: 'search-outline' },
    { name: 'Filter', icon: 'cog-outline' },
   { name: 'Notification', icon: 'notifications-outline',type:'NOTIFICATION' },
    { name: 'Approvals', icon: 'layers-outline' },
            
            

  ];

  


  headerDisplayArraySrc:any=[
    { name: 'Search', icon: 'search-outline' },
    { name: 'Filter', icon: 'cog-outline' },
       { name: 'Notification', icon: 'notifications-outline',type:'NOTIFICATION' },
        { name: 'Approvals', icon: 'layers-outline' },
        
        
  ];
  actionEventHeader(e: any) {
    this.checkOwnstore()
    if (e?.name == 'Search') {
      this.searchTractor();
    } else if (e?.name == 'Filter') {
      this.openFilter();
    }
    else if(e?.name == 'Notification'){
      this.openNotidication()
    }
        else if(e?.name == 'Approvals'){
      this.openApproveList()
    }
  }
    async openApproveList() {
  
    const modal = await this.modalCtrl.create({
      component: ViewAppovalsListComponent,
      componentProps: {
    selectedStore:this.selectedStore
      },
      cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data) {
   
    }
  }
checkAlloteStoreMethod(){
   let checkAllotedStore=this.allotedWareHouse.find((f:any)=>f?.id==this.selectedStore)
    if(!checkAllotedStore){
      this.headerDisplayArray.splice(3)
    }
}
  tractorListStorewise(e:any){
    this.headerDisplayArray=JSON.parse(JSON.stringify(this.headerDisplayArraySrc))
    this.selectedStore=e?.selectedStore
 //this.checkAlloteStoreMethod()
this.getAllTractorListStorewise(true)
  }

  filterBy: any = 'ALL';
  listBy = 'ALL';
  checkedAll = true;

  async openFilter() {
  
    const modal = await this.modalCtrl.create({
      component: GlobalFilterTractorComponent,
      componentProps: {
        filterBy: this.filterBy,
        listBy: this.listBy,
        listColorClass: this.listColorClass,
        optionsArray: [
          { displayName: 'All', value: 'ALL' },

          { displayName: 'Not Sold', value: 'NOT_SOLD' },
          { displayName: 'Sold', value: 'SOLD' },
        ],
        selectedBrand: this.selectedBrand,
        checkedAll: this.checkedAll,
        lower: this.lower,
        upper: this.upper,
        yearChecked: this.yearChecked,
        wheeldrive: this.wheeldrive,
        brandList:this.brandList
     
      },
      cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data) {
      this.selectedBrand = data?.selectedBrand;
      this.checkedAll = data?.checkedAll;
      this.lower = data?.lower;
      this.upper = data?.upper;
      this.yearChecked = data?.yearChecked;
      this.wheeldrive = data?.wheeldrive;
      this.listBy=data?.listBy
      this.filterBy=data?.filterBy
      this.filterActiveAndFilterBy();
    }
  }
 
  filterActiveAndFilterBy() {
        this.alltractorList = [];
        setTimeout(() => {
             let tractorList: any = [];
    if (this.listBy == 'ALL') {
      tractorList = JSON.parse(JSON.stringify(this.allTractorsSrcList));
    } else if (this.listBy == 'ARCHIVED') {
      tractorList = this.allTractorsSrcList.filter(
        (f: any) => f.tractor_status == 'ARCHIVED'
      );
    } else if (this.listBy == 'ACTIVE') {
      tractorList = this.allTractorsSrcList.filter(
        (f: any) => f.tractor_status != 'ARCHIVED'
      );
    }
       if (this.filterBy == 'ALL') {
      tractorList = tractorList
    } else if (this.filterBy == 'SOLD') {
      tractorList = tractorList.filter(
           (f: any) => f?.isSold == 1
      );
    } else if (this.filterBy == 'NOT_SOLD') {
      tractorList = tractorList.filter(
             (f: any) => f?.isSold == 0
      );
    }



    this.sortByFilter(tractorList)  
        }, 0);
 
  }
  sortByFilter(tractorList:any) {

    let filteredList = [];
    if (!this.checkedAll) {
      // filteredList = this.share.filterByBrand(
      //   this.allTractorsSrcList,
      //   this.selectedBrand
      // );
        filteredList = this.share.filterByBrand(
        tractorList,
        this.selectedBrand
      );
    } else {
      filteredList = JSON.parse(JSON.stringify(tractorList));
    }
    filteredList = this.share.filterByPrice(
      filteredList,
      this.lower,
      this.upper
    );

    filteredList = this.share.filterByManuYear(filteredList, this.yearChecked);
   // this.alltractorList = filteredList;
      this.allFilterList=filteredList
    if(filteredList?.length>10){
 this.alltractorList=filteredList.slice(0, 10);
 this.holddingList= filteredList.slice(10,filteredList?.length);
  
    }else{
    this.alltractorList=filteredList
     this.holddingList=[]
    }
          this.holddingList?.forEach((tractor: any) => {
      this.share.getImagesToShow(tractor)
    })
  }
    expandListEvent(){
  //  this.share.showLoading("Rendering Data...")
  this.share.presentToast("Expanding...")
  setTimeout(() => {
      if(this.alltractorList?.length<this.allFilterList?.length){
  this.alltractorList = [...this.alltractorList, ...this.holddingList]
    }
  }, 0);
  
  setTimeout(() => {
    //this.share.spinner.dismiss()
  }, 0);
 
  }
  holddingList=[]
  allFilterList=[]
  async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
        buttonArray: [
        {
      name: 'View Refurbish Details',
      action: 'viewRefurbishDetails',
      image: './././assets/images/layout.png',
    },
         {
      name: 'View Tractor All Images',
      action: 'viewTractorAllImage',
      image: './././assets/images/all_image_icon.png',
    },
      ],
        listColorClass: this.listColorClass,
        keyList: this.keyList,
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: [] },
      },
          cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
    async openNotidication() {
    const modal = await this.modalCtrl.create({
      component: NotificationPopUpComponent,
      componentProps: {

      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  alltractorList: any = [];
  allTractorsSrcList: any = [];
  getAllTractorListStorewise(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if (!this.selectedStore) {
      this.selectedStore = this.warehouseList[0]?.id;
    }
    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id: this.selectedStore,
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }
      let takingTime=true
    setTimeout(() => {
  if(takingTime){
  this.share.presentToast("Taking Time,Please Wait...")
}

}, 2000);
    this.alltractorList = [];
        this.checkOwnstore()
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
    
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

 this.checkAlloteStoreMethod()
   this.putImage();
   this.share.putMappedValue(this.alltractorList,this.allTractorsSrcList);
     
        this.share.traceTractorPosition(this.alltractorList,this.allTractorsSrcList);
        this.share.checkedRepairStatus(this.alltractorList,this.allTractorsSrcList);
        //this.sortByFilter()
        this.share.spinner.dismiss('active_one');
         
           this.filterActiveAndFilterBy() 
               let takingTime=false  
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
   putImage() {
    this.alltractorList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor);
    });
    this.allTractorsSrcList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor);
    });
  }

  search = {
    registractionNo: null,
  };
  buttonArray: any = [
  
     {
      name: 'Upload Recive Tractor Image',
      action: 'reciveTractorImage',
      image: './././assets/images/image_upload.png',
    },
      {
      name: 'Approval Request',
      action: 'approvalRequest',
      image: './././assets/images/request.png',
    },
         {
      name: 'View Tractor All Images',
      action: 'viewTractorAllImage',
      image: './././assets/images/all_image_icon.png',
    },
   
  ];
  keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Engine Number', value: 'engineNumber', type: 'INPUT' },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },

    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },

    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Price', value: 'price', type: 'INPUT' },
  { key: 'Mapped To Repair', value: 'isMapped', type: 'CONDITIONAL' },
    { key: 'Refurbish Status', value: 'repairStatus', type: 'INPUT' },
    { key: 'Status', value: 'tractor_status_current', type: 'INPUT' },

    {
      key: 'Franchise(Alloted)',
      getFromObj: true,
      objName: 'franchiseDettails',
      value: 'name',
      type: 'INPUT',
    },
   
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
 async actionEventCall(e: any) {
  e.selectedStore=this.selectedStore
      await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })

  }
}
