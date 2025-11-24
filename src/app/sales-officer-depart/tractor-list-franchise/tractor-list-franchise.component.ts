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
  ionViewWillEnter() {
        let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    this.checkedAll = true;
    this.selectedBrand = [];
    this.lower = 0;
    this.listBy='ACTIVE'
    this.filterBy='NOT_SOLD'
    this.upper = 1500000;
    this.yearChecked = 'ALL';
    //this.alltractorList = [];
    this.getBrandList();
    this.getWareHouseList();

    // this.getTractorList();
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
                this.selectedStore = this.warehouseList[0]?.id;
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
      this.buttonArray=[]
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
   
  ];
  headerDisplayArray = [
    { name: 'Search', icon: 'search-outline' },
    { name: 'Filter', icon: 'cog-outline' },
  
        { name: 'Approvals', icon: 'layers-outline' },
  ];
  actionEventHeader(e: any) {
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
    
      },
      cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data) {
   
    }
  }
 
  tractorListStorewise(e:any){
    this.selectedStore=e?.selectedStore
this.getAllTractorListStorewise()
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
    this.alltractorList = filteredList;
  }
  async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
        buttonArray: this.buttonArray,
        listColorClass: this.listColorClass,
        keyList: this.keyList,
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: [] },
      },
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
    this.alltractorList = [];
        this.checkOwnstore()
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
    
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  this.filterActiveAndFilterBy()

        //this.sortByFilter()
        this.share.spinner.dismiss('active_one');
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
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

    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
 async actionEventCall(e: any) {
  e.selectedStore=this.selectedStore
      await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })

  }
}
