import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from 'src/app/shared-components/tractor-dashboard/tractor-dashboard.component';
import { Router } from '@angular/router';
import { TractorSellsDetailsComponent } from 'src/app/tractor-sells-details/tractor-sells-details.component';
import { SyncTractorWithMaintaninanceComponent } from 'src/app/shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SelectListTypeComponent } from 'src/app/shared-components/select-list-type/select-list-type.component';
import { TractorFinanceDetailsComponent } from 'src/app/tractor-finance-details/tractor-finance-details.component';
import { NocUpdateComponent } from 'src/app/rto-management/rto-noc/noc-update/noc-update.component';
import { NocViewOptionsComponent } from 'src/app/rto-management/rto-noc/noc-view-options/noc-view-options.component';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
import { RtoOptionsComponent } from 'src/app/rto-management/rto-options/rto-options.component';
import { SearchRtoNocComponent } from 'src/app/rto-management/rto-noc/search-rto-noc/search-rto-noc.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-branchwise-tractor-list',
  templateUrl: './branchwise-tractor-list.component.html',
  styleUrls: ['./branchwise-tractor-list.component.scss'],
})
export class BranchwiseTractorListComponent  implements OnInit {

  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod:CommonMethodService
  ) {}
  alltractorList: any = [];
  optionsArray = [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Not Assigned', value: 'NOT_ASSIGNED' },
    { displayName: 'Yes', value: 'YES' },
    { displayName: 'No', value: 'NO' },
  ];
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];

    this.getWareHouseList();
    this.filterBy = 'ALL';
    this.listBy = 'BRAND_WISE';
    // this.getTractorList();
  }
  filterBy: any = 'ALL';
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: SelectListTypeComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {
        filterBy: this.filterBy,
        filterByTitle: 'Is NOC',
        listBy: this.listBy,
        showFilter: true,
        optionsArray: this.optionsArray,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data && data?.isFilterChange) {
      console.log('data', data);
      this.filterBy = data?.filterBy;
      this.sortByFilter();
    }
    if (data && data?.isListChange) {
      console.log('data', data);
      this.listBy = data?.listBy;
      this.callListApi();
    }
  }


  listBy = 'BRAND_WISE';
  refreshList() {
    this.getWareHouseList();
  }



 
  search = {
    registractionNo: null,
  };
  brandList: any = [];
  selectedBrand: any;

  staffDetails: any;

  allTractorsSrcList: any = [];


  selectedStore: any;
  warehouseList: any = [];
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

          console.log('this.warehouseList', this.warehouseList);
      
            this.selectedStore = this.warehouseList[0]?.id;
           this.getAllTractorListStorewise();
            //  this.getAllTractorListStorewise();
            //   this.share.spinner?.dismiss();
  
        },
        (error: any) => {}
      );
    }, 0);
  }
  callListApi() {
 this.getAllTractorListStorewise()
  }
  sortByFilter() {
  
  }
  listColorClass='firstColor'
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
      this.alltractorList=[]
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

        this.sortByFilter();
        this.share.spinner.dismiss('active_one');
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }


  backupList: any = [];

  async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
       buttonArray: this.buttonArray,
       keyList:this.keyList,
       searchFilter:this.search,
       searchKey:'registractionNo',
     obj:{optionsUploadButtonArray:this.optionsUploadButtonArray}
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  keyList: any = [
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Price', value: 'price', type: 'INPUT' },
    
    { key: 'Is Sold ', value: 'isSold', type: 'CONDITIONAL' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
    optionsUploadButtonArray: any = [
   
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Upload NOC',
      showHeading: 'Upload NOC',
      param: 'NOC_DOCUMENT_RTO',
      showDeleteButton: true,
      uploadPhoto: true,
      type: 'IMAGE',
      icon: '././assets/images/documentation.png',
    }
     
   
  ];
  buttonArray: any = [
    {
      name: 'Tractor Price',
      action: 'TractorPrice',
      image: './././assets/images/rupee-sign.png',
    }
      
  ];

 async actionEventCall(e: any) {
  await  this.commonMethod.actionEventCall(e,{optionsUploadButtonArray:this.optionsUploadButtonArray})
    
  if(this.commonMethod.reloadMethod){
    this.callListApi()
  }
    console.log('actionEventCall', e);
    // if (e?.button?.name == 'IS Noc') {
    //   this.nocUpdate(e?.tractor);
    // }
    // if (e?.button?.name == 'View Details') {
    //   this.viewDetails(e?.tractor);
    // }
    
  }


}
