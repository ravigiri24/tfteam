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

import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';

import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit {
  constructor(
    private api: ApiService,
    private share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod: CommonMethodService,
    private route: Router
  ) {}
  alltractorList: any = [];
  optionsArray = [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Not Assigned', value: 'NOT_ASSIGNED' },
    { displayName: 'Yes', value: 'YES' },
    { displayName: 'No', value: 'NO' },
  ];
  ngOnInit() {}
  storeId:any
  ionViewWillEnter() {
     let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    this.storeId= this.staffDetails?.storeId

    this.alltractorList = [];
    this.getBrandList();
    this.getWareHouseList();
    this.getAllTractorList();
    this.filterBy = 'ALL';
    this.listBy = 'ALL';
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
        showFilter: false,
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

  search = {
    registractionNo: null,
  };
  brandList: any = [];
  selectedBrand: any;
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
          if (!loader) {
            this.selectedBrand = this.brandList[0]?.id;

            //this.getTractorList();
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
      isDraft: true,
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
    this.api.postapi('getTractorListAll_Inventory_Store', obj).subscribe(
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
    this.alltractorList = this.alltractorList.filter(
      (f: any) => f.tractor_status == 'IN_ARRIVAL_STOCK'
    );
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
    this.api.postapi('getTractorListAll_Inventory_Store', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data?.filter((inv:any)=>inv?.inventoryStoreId==this.selectedStore);
        this.allTractorsSrcList = res?.data?.filter((inv:any)=>inv?.inventoryStoreId==this.selectedStore);;

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
        keyList: this.keyList,
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: this.optionsUploadButtonArray },
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  keyList: any = [
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Store', value: 'name',getFromObj:true,objName:'inventoryStoreDetails', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  optionsUploadButtonArray: any = [
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Before Service',
      showHeading: 'Upload Before Service',
      param: 'BEFORE_SERVICE',
      showDeleteButton: false,
      uploadPhoto: false,
      type: 'IMAGE',
      icon: '././assets/images/image-upload.png',
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Engine Number Image',
      showHeading: 'Upload Engine Number Image',
      param: 'ENGINE_NUMBER',
      showDeleteButton: false,
      uploadPhoto: false,
      type: 'IMAGE',
      icon: '././assets/images/search-engine.png',
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Chasis Number Image',
      showHeading: 'Upload Chasis Number Image',
      param: 'CHASIS_NUMBER',
      showDeleteButton: false,
      uploadPhoto: false,
      type: 'IMAGE',
      icon: '././assets/images/case.png',
    },
    {
      functionName: 'deleteTractor',
      optionsName: 'Delete',
      type: 'FUNCTION_CALL',
      closeOptionAndRefresh: true,
      funcName: 'deleteTractor',
      icon: '././assets/images/deleted.png',
    },
  ];
  buttonArray: any = [
    {
      name: 'Inventory-to-new',
      action: 'inventoryToNewArrivals',
      image: './././assets/images/log-in.png',
      goToPage: '/purchase-management/edit-newarrivals',
      srcPage: '/purchase-management/inventory-list',
    },
        {
      name: 'New Arrival Settings',
      action: 'newArrivalSettings',
      image: './././assets/images/visual.png',
    },
    //   {
    //   name: 'New Arrival Settings',
    //   action: 'newArrivalSettings',
    //   image: './././assets/images/settings.png',
    // },
  ];
  goToNewArival(data: any = null) {
    let rand = Math.random();

    this.route.navigate([
      '/inventory-receive-department/add-new-arrivals',
      rand,
      '/inventory-receive-department/inven-received-list',
    ]);
  }

  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: this.optionsUploadButtonArray,
    });

    if (this.commonMethod.reloadMethod) {
      this.callListApi();
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
