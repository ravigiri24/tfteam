import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from '../shared-components/tractor-dashboard/tractor-dashboard.component';
import { Router } from '@angular/router';
import { SyncTractorWithMaintaninanceComponent } from '../shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { SearchTractorWithTfCodeComponent } from '../shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SelectListTypeComponent } from '../shared-components/select-list-type/select-list-type.component';
import { TractorCostingDashboardComponent } from '../shared-components/tractor-costing-dashboard/tractor-costing-dashboard.component';
import { CommonMethodService } from '../common-method.service';
@Component({
  selector: 'app-all-tractor-list',
  templateUrl: './all-tractor-list.component.html',
  styleUrls: ['./all-tractor-list.component.scss'],
})
export class AllTractorListComponent implements OnInit {
  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod: CommonMethodService
  ) { }
  alltractorList: any = [];
  listColorClass = 'sixColor';
  ngOnInit() { }
  ionViewWillEnter() {
    this.alltractorList = [];
    this.getBrandList();
    this.getWareHouseList();
    this.filterBy = "ALL"
    this.listBy = "BRAND_WISE"
    // this.getTractorList();
  }
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })

    if (this.commonMethod.reloadMethod) {
      this.getTractorList()
    }


    if (this.commonMethod.reloadMethod) {
      this.refreshList();
    }
    console.log('actionEventCall', e);

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
        listBy: this.listBy,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data && data?.isFilterChange) {
      console.log('data', data);
      this.filterBy = data?.filterBy;
      this.sortByFilter()
    }
    if (data && data?.isListChange) {
      console.log('data', data);
      this.listBy = data?.listBy;
      this.callListApi()
    }
  }
  buttonArray: any = [
    {
      name: 'Tractor Dashboard',
      action: 'tractorDashboard',
      closeCurrentPopUP: true,
      srcPage: '/operational/all-tractor-management',
      image: './././assets/images/layout.png',
    },
    {
      name: 'Sync Mainatainance',
      action: 'syncMainatinance',
      image: './././assets/images/sync.png',
    },
    {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
    },

  ];
  keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Engine Number', value: 'engineNumber', type: 'INPUT' },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'D.O.A(Actual)', value: 'actualReleaseDate', type: 'INPUT' },
    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },


    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Transported Place', getFromObj: true, objName: 'transportDestination', value: 'name', type: 'INPUT' },
    { key: 'Franchise(Alloted)', getFromObj: true, objName: 'franchiseDettails', value: 'name', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  listBy = 'BRAND_WISE';
  refreshList() {
    this.getTractorList();
  }
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
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
        (error: any) => { }
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
      this.selectedBrand = this.brandList[0]?.id
    }
    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      brandId: this.selectedBrand,
      isDraft: false
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }

    this.api.postapi('getTractorListBranchWiseisLiveNotDraft', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.sortByFilter()
        this.share.spinner.dismiss('active_six');
        this.backupList = res.data;
      },
      (error: any) => { }
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

    this.api.postapi('getTractorListLiveNotDraft', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.sortByFilter()
        this.share.spinner.dismiss('active_six');
        this.backupList = res.data;
      },
      (error: any) => { }
    );
  }
  async tractorViewDetail(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorCostingDashboardComponent,
      componentProps: {

        tractor_id: tractor?.id,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    //   this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
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
        (error: any) => { }
      );
    }, 0);
  }
  callListApi() {
    this.filterBy = 'ALL'
    if (this.listBy == 'ALL') {
      this.getAllTractorList();
    } else if (this.listBy == 'BRAND_WISE') {
      this.getTractorList(true);
    } else if (this.listBy == 'STORE_WISE') {
      this.getAllTractorListStorewise();
    }

  }
  sortByFilter() {
    this.alltractorList = []
    setTimeout(() => {
      if (this.filterBy == 'ALL') {
        if (this.allTractorsSrcList?.length) {
          this.alltractorList = JSON.parse(JSON.stringify(this.allTractorsSrcList))
        }
        else {
          this.alltractorList = []
        }
      }
      if (this.filterBy == 'MAPPED') {
        this.alltractorList = this.allTractorsSrcList.filter(
          (f: any) => f?.repairMappedData?.length > 0
        );
      }
      if (this.filterBy == 'NOT_MAPPED') {
        this.alltractorList = this.allTractorsSrcList.filter(
          (f: any) => f?.repairMappedData?.length == 0
        );
      }
      if (this.filterBy == 'SOLD') {
        this.alltractorList = this.allTractorsSrcList.filter(
          (f: any) => f?.isSold == 1
        );
      }
      if (this.filterBy == 'NOT_SOLD') {
        this.alltractorList = this.allTractorsSrcList.filter(
          (f: any) => f?.isSold == 0
        );
      }
    }, 0);

  }
  getAllTractorListStorewise(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if (!this.selectedStore) {
      this.selectedStore = this.warehouseList[0]?.id
    }
    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id: this.selectedStore,
    };
    //if (loader) {
    this.share.showLoading('Loading...');
    //}
    this.api.postapi('getTractorsListStoreWiseNotDraft', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

        this.sortByFilter()
        this.share.spinner.dismiss('active_six');
        this.backupList = res.data;
      },
      (error: any) => { }
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
        listColorClass: this.listColorClass,
        keyList: this.keyList,
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: [] }
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }

}
