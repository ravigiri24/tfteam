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
import { NocUpdateComponent } from './noc-update/noc-update.component';
import { NocViewOptionsComponent } from './noc-view-options/noc-view-options.component';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
import { RtoOptionsComponent } from '../rto-options/rto-options.component';
import { SearchRtoNocComponent } from './search-rto-noc/search-rto-noc.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-rto-noc',
  templateUrl: './rto-noc.component.html',
  styleUrls: ['./rto-noc.component.scss'],
})
export class RtoNocComponent implements OnInit {
  constructor(
    private api: ApiService,
    private share: ShareService,
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
    this.getBrandList();
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
    this.getTractorList();
  }
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
  async salesOption(tractor: any) {
    // const modal = await this.modalCtrl.create({
    //   component: FinanceOptionsComponent,
    //   componentProps: {
    //     tractor: tractor,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);
  }
  async addFinanceDetails(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorFinanceDetailsComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if (data) {
      this.callListApi();
    }
    //if (role === 'confirm') {

    //   this.getAllTractorList();
    //}
  }
  async addSellDetails(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorSellsDetailsComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    //if (role === 'confirm') {
    this.callListApi();
    //}
  }
  search = {
    registractionNo: null,
  };
  brandList: any = [];
  selectedBrand: any;
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

          console.log('  this.brandList', this.brandList);
          if (!loader) {
            this.selectedBrand = this.brandList[0]?.id;

            this.getTractorList();
            //   this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  staffDetails: any;
  async syncManitainance(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: SyncTractorWithMaintaninanceComponent,
      componentProps: {
        tractor: tractor,
      },
    });
    await modal.present();
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
  allTractorsSrcList: any = [];
  getTractorList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    if (!this.selectedBrand) {
      this.selectedBrand = this.brandList[0]?.id;
    }
    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      brandId: this.selectedBrand,
         isDraft:true
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }

    this.api.postapi('getTractorListBranchWiseisLive', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.sortByFilter();
       // this.share.globalLoading=false
       this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  getAllTractorList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
    };
    //if (loader) {
    this.share.showLoading('Loading...');
    // }
    this.api.postapi('getTractorListLive', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.sortByFilter();
        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
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

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();

          console.log('this.warehouseList', this.warehouseList);
          if (!loader) {
            this.selectedStore = this.warehouseList[0]?.id;

            //  this.getAllTractorListStorewise();
            //   this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  callListApi() {
    this.filterBy = 'ALL';
    if (this.listBy == 'ALL') {
      this.getAllTractorList();
    } else if (this.listBy == 'BRAND_WISE') {
      this.getTractorList(true);
    } else if (this.listBy == 'STORE_WISE') {
      this.getAllTractorListStorewise();
    }
  }
  sortByFilter() {
    let date =new Date('04/01/2022');
    console.log('New', new Date('06/01/2025'));
    if (this.filterBy == 'ALL') {
      this.alltractorList = this.allTractorsSrcList.filter(
        (f: any) => new Date(f?.createdOn) >= date
      );
    } else if (this.filterBy == 'NOT_ASSIGNED') {
      this.alltractorList = this.allTractorsSrcList.filter(
        (f: any) => new Date(f?.createdOn) >= date && f?.isNoc == null
      );
    } else if (this.filterBy == 'YES') {
      this.alltractorList = this.allTractorsSrcList.filter(
        (f: any) => new Date(f?.createdOn) >= date && f?.isNoc == 1
      );
    } else if (this.filterBy == 'NO') {
      this.alltractorList = this.allTractorsSrcList.filter(
        (f: any) => new Date(f?.createdOn) >= date && f?.isNoc == 0
      );
    }
  }
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
    //if (loader) {
    this.share.showLoading('Loading...');
    //}
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

        this.sortByFilter();
        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  async viewImage(tractor: any) {
    // const modal = await this.modalCtrl.create({
    //   component: ImageViewerComponent,
    //   componentProps: {
    //     tarctor_id: tractor.id,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);
    // if (role === 'confirm') {
    // }
  }
  async viewTractorDashboard(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorDashboardComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    this.getTractorList();
  }
  backupList: any = [];
  tractorDashboard(tractor: any) {
    this.router.navigate([
      '/operational/view-dashboard',
      tractor?.id,
      '/operational/all-tractor-management',
    ]);
  }
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
        { key: 'Noc Availaible ', value: 'isNoc', type: 'CONDITIONAL' },
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
      name: 'IS Noc',
      action: 'nocUpdate',
      image: './././assets/images/stamp.png',
    },
      {
      name: 'View Details',
      action: 'viewDetails',
      image: './././assets/images/visual.png',
    },
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
  async salesDetails(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: ShowSalesDetailsComponent,
      componentProps: {
        tractor: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
}
