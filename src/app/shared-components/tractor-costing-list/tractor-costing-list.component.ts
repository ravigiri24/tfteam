import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from '../tractor-dashboard/tractor-dashboard.component';

import { Router } from '@angular/router';
import { TractorCostingDashboardComponent } from '../tractor-costing-dashboard/tractor-costing-dashboard.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { SearchTractorWithTfCodeComponent } from '../search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { GlobalFilterTractorComponent } from '../global-filter-tractor/global-filter-tractor.component';
@Component({
  selector: 'app-tractor-costing-list',
  templateUrl: './tractor-costing-list.component.html',
  styleUrls: ['./tractor-costing-list.component.scss'],
})
export class TractorCostingListComponent implements OnInit {
  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod: CommonMethodService
  ) {}
  alltractorList: any = [];
  ngOnInit() {}
  selectedStore: any;
  ionViewWillEnter() {
    this.alltractorList = [];
    this.resetFilterVal();

    this.getBrandList();
    this.getWareHouseList();
  }
  checkedAll = true;
  selectedBrand: any = [];
  lower = 0;
  upper = 0;
  yearChecked = 'ALL';
  resetFilterVal() {
    this.checkedAll = true;
    this.selectedBrand = [];
    this.lower = 0;
    this.listBy = 'ACTIVE';
    this.filterBy = 'NOT_SOLD';
    this.upper = 1500000;
    this.yearChecked = 'ALL';
  }
  warehouseList: any = [];

  allotedWareHouse: any = [];
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
          if (!loader) {
            this.selectedStore = this.warehouseList[0]?.id;

            this.getAllTractorListStorewise();
            //this.share.spinner?.dismiss();
          }
          this.share.putAllInWareHouse( this.warehouseList)
         
        },
        (error: any) => {}
      );
    }, 0);
  }
  tractorListStorewise(e: any) {
    this.selectedStore = e?.selectedStore;
    this.getAllTractorListStorewise(true);
  }
  allTractorsSrcList: any;
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

    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        this.putMappedValue()
        this.putImage()
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.filterActiveAndFilterBy();

        //this.sortByFilter()
        this.share.spinner.dismiss('active_one');
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  putImage(){
        this.alltractorList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor)
    })
        this.allTractorsSrcList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor)
    })
  }
  putMappedValue() {
    this.alltractorList?.forEach((trac: any) => {
      if (trac?.repairMappedData?.length > 0) {
        trac.isMapped = true;
      } else {
        trac.isMapped = false;
      }
    });
       this.allTractorsSrcList?.forEach((trac: any) => {
      if (trac?.repairMappedData?.length > 0) {
        trac.isMapped = true;
      } else {
        trac.isMapped = false;
      }
    });
  }
  listBy = 'ACTIVE';
  filterBy: any = 'NOT_SOLD';

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
        tractorList = tractorList;
      } else if (this.filterBy == 'SOLD') {
        tractorList = tractorList?.filter((f: any) => f?.isSold == 1);
      } else if (this.filterBy == 'NOT_SOLD') {
        tractorList = tractorList?.filter((f: any) => f?.isSold == 0);
      }
      if (this.filterBy == 'MAPPED') {
        tractorList = tractorList?.filter(
          (f: any) => f?.repairMappedData?.length > 0
        );
      }
      if (this.filterBy == 'NOT_MAPPED') {
        tractorList = tractorList?.filter(
          (f: any) => f?.repairMappedData?.length == 0
        );
      }
           if (this.filterBy == '0_IMAGE') {
        tractorList = tractorList?.filter(
          (f: any) => f?.imagesInTractor?.length == 0
        );
      }
              if (this.filterBy == 'HAVE_IMAGE') {
        tractorList = tractorList?.filter(
          (f: any) => f?.imagesInTractor?.length > 0
        );
      }
      

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
      filteredList = this.share.filterByBrand(tractorList, this.selectedBrand);
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
    if(this.alltractorList?.length>50){
      this.share.showLoading("Rendering Data",2000)
    }
  }
  headerDisplayArray = [
    { name: 'Search', icon: 'search-outline' },
    { name: 'Filter', icon: 'cog-outline' },
  ];
  actionEventHeader(e: any) {
    if (e?.name == 'Search') {
      this.searchTractor();
    } else if (e?.name == 'Filter') {
      this.openFilter();
    }
  }
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
          { displayName: 'Mapped', value: 'MAPPED' },
          { displayName: 'Not-Mapped', value: 'NOT_MAPPED' },
          { displayName: '0-Image', value: '0_IMAGE' },
          { displayName: 'Have Image', value: 'HAVE_IMAGE' },
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
      this.listBy = data?.listBy;
      this.filterBy = data?.filterBy;
      this.filterActiveAndFilterBy();
    }
  }
  listColorClass = 'secondColor';
  buttonArray: any = [
    {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
    },
  ];
  keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
     { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Price', value: 'price', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },

    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },
    { key: 'Mapped To Repair', value: 'isMapped', type: 'CONDITIONAL' },


    {
      key: 'Franchise(Alloted)',
      getFromObj: true,
      objName: 'franchiseDettails',
      value: 'name',
      type: 'INPUT',
    },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  search = {
    registractionNo: null,
  };
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });

    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }

    console.log('actionEventCall', e);
  }
  refreshList() {
    this.getTractorList();
  }
  brandList: any = [];
  //selectedBrand: any;
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
        (error: any) => {}
      );
    }, 0);
  }
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
  staffDetails: any;

  getTractorList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      brandId: this.selectedBrand,
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }
    this.alltractorList = [];
    this.api.postapi('getTractorListBranchWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

        this.share?.spinner?.dismiss('active_two');
        this.backupList = res.data;
      },
      (error: any) => {}
    );
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
  async tractorDashboard(tractor: any) {
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
  backToList() {
    this.router.navigate(['/operational/all-tractor-management']);
  }
}
