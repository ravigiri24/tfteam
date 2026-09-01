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
import { FinanceOptionsComponent } from '../finance-options/finance-options.component';
import { ShowSalesDetailsComponent } from '../show-sales-details/show-sales-details.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { GlobalFilterTractorComponent } from 'src/app/shared-components/global-filter-tractor/global-filter-tractor.component';
@Component({
  selector: 'app-live-tractor-list',
  templateUrl: './live-tractor-list.component.html',
  styleUrls: ['./live-tractor-list.component.scss'],
})
export class LiveTractorListComponent implements OnInit {
  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod: CommonMethodService
  ) {}
  alltractorList: any = [];
  ngOnInit() {}
    headerDisplayArray = [
    { name: 'Search', icon: 'search-outline' },
    { name: 'Filter', icon: 'cog-outline' },
  ];
  listColorClass = 'fourthColor';
    selectedStore: any="ALL";
  ionViewWillEnter() {
    this.alltractorList = [];
       this.share.totalCount=0
  this.resetFilterVal();
   
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    this.alltractorList = [];
    this.isStoreOnlyAccess = false;

    // if (!this.share.checkStoreOnlyAccess()) {
    //   this.listBy = 'BRAND_WISE';

    //   this.getBrandList();
    // } else {
    //   this.listBy = 'STORE_WISE';
    // }
    this.getBrandList()
    this.getWareHouseList();
    // this.getTractorList();
  }
    tractorListStorewise(e: any) {
    this.selectedStore = e?.selectedStore;
    this.getDataByFilter(true);
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
      this.share.showLoading('Loading...', 1000);
    }
    this.alltractorList = [];
    let takingTime = true;
    setTimeout(() => {
      if (takingTime) {
        this.share.presentToast('Taking Time,Please Wait...');
      }
    }, 2000);
    this.api.postapi('getTractorsListStoreWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
  
        this.putImage();
        this.traceTractorPosition();
    ;
        setTimeout(() => {
          this.share.spinner.dismiss('active_one');
        }, 0);

        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        takingTime = false;
        this.filterActiveAndFilterBy();

        //this.sortByFilter()

        //this.backupList = res.data;
      },
      (error: any) => {},
    );
  }
    traceTractorPosition() {
    this.alltractorList?.forEach((tractor: any) => {
      if (tractor?.isLive == 0 && tractor?.tractor_status == 'NEW_ARRIVAL') {
        tractor.tractor_status_current = 'New Arrivals';
      }
      if (tractor?.isLive == 0 && tractor?.tractor_status == 'AT_TRANSPORT') {
        tractor.tractor_status_current = 'At Trasport';
      }
      if (
        tractor?.isDraft == 1 &&
        tractor?.isLive == 1 &&
        tractor?.tractordetailadmin?.wareHouseLocation == null
      ) {
        tractor.tractor_status_current = 'At WareHouse';
      }
      if (
        tractor?.isDraft == 1 &&
        tractor?.isLive == 1 &&
        tractor?.tractordetailadmin?.wareHouseLocation != null
      ) {
        tractor.tractor_status_current = 'Alloted(At Dealer)';
      }
      if (tractor?.isDraft == 0 && tractor?.isLive == 1) {
        tractor.tractor_status_current = 'Live';
      }
    });

    this.allTractorsSrcList?.forEach((tractor: any) => {
      if (tractor?.isLive == 0 && tractor?.tractor_status == 'NEW_ARRIVAL') {
        tractor.tractor_status_current = 'New Arrivals';
      }
      if (tractor?.isLive == 0 && tractor?.tractor_status == 'AT_TRANSPORT') {
        tractor.tractor_status_current = 'At Transport';
      }
      if (
        tractor?.isDraft == 1 &&
        tractor?.isLive == 1 &&
        tractor?.tractordetailadmin?.wareHouseLocation == null
      ) {
        let arch = '';
        if (tractor?.tractor_status == 'ARCHIVED') {
          arch = '(Archived)';
        }
        tractor.tractor_status_current = 'At WareHouse' + arch;
      }
      if (
        tractor?.isDraft == 1 &&
        tractor?.isLive == 1 &&
        tractor?.tractordetailadmin?.wareHouseLocation != null
      ) {
        let arch = '';
        if (tractor?.tractor_status == 'ARCHIVED') {
          arch = '(Archived)';
        }
        tractor.tractor_status_current = 'Alloted(At Dealer)' + arch;
      }
      if (tractor?.isDraft == 0 && tractor?.isLive == 1) {
        tractor.tractor_status_current = 'Live';
      }
    });
  }
  putImage() {
    this.alltractorList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor);
    });
    this.allTractorsSrcList?.forEach((tractor: any) => {
      this.share.getImagesToShowPut(tractor);
    });
  }
   allFilterList: any = [];
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
            { displayName: 'Booked', value: 'BOOKED' },
            { displayName: 'RC Ready', value: 'RC_READY' },
            { displayName: 'Have Finance Details', value: 'HAVE_FINANCE_DETAILS' },
           { displayName: 'Sold(Dealer)', value: 'SOLD_TO_DEALER' },
          { displayName: 'Not Sold(Dealer)', value: 'SOLD_NOT_TO_DEALER' },

          ],
          selectedBrand: this.selectedBrand,
          checkedAll: this.checkedAll,
          lower: this.lower,
          upper: this.upper,
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
        this.lower = data?.lower;
        this.upper = data?.upper;
        this.yearChecked = data?.yearChecked;
        this.listBy = data?.listBy;
        this.filterBy = data?.filterBy;
        //this.filterActiveAndFilterBy();
        this.getDataByFilter(true);
      }
    }
      resetFilterVal() {
    this.checkedAll = true;
    this.selectedBrand = [];
    this.allFilterList = [];

    this.lower = 0;
    this.listBy = 'ACTIVE';
    this.filterBy = 'BOOKED';
    this.upper = 1500000;
    this.yearChecked = 'ALL';
    this.selectedStore="ALL"
  }
      listBy = 'ACTIVE';
  filterBy: any = 'BOOKED';
  totalListCount=0
getDataByFilter(loader:any,listType:any='UP'){
  // this.share.totalCount=0
 let staffDetails: any = this.share.get_staff();
 this.staffDetails = JSON.parse(staffDetails);
 let brandList:any=[]
 this.selectedBrand?.forEach((f:any)=>{
  brandList.push(f?.id)
 })
  let listBy=[{filter:this.listBy}]
  let brand=[{filter:"ALL"}]
  let obj:any={
    listBy:listBy,
    filterBy:[{filter:this.filterBy}],
    brand:brand,
    lower:this.lower,
    checkedAll:this.checkedAll,
    listType:listType,

    brandList:brandList,
    upper:this.upper,
    
    yearChecked:this.yearChecked,
     operate: this.staffDetails?.staffCode,
      store_id: this.selectedStore,
    

  }
    if (loader) {
      this.share.showLoading('Loading...', 1000);
    }
    //this.alltractorList = [];
    let takingTime = true;
    setTimeout(() => {
      if (takingTime) {
        this.share.presentToast('Taking Time,Please Wait...');
      }
    }, 2000);
    this.api.postapi('getTractorsListStoreWiseFilerWise', obj).subscribe(
      (res: any) => {
      //  this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data?.tractorList;
  
   let responsData=res?.data?.tractorList
   this.totalListCount=res?.data?.totalDataCount
    this.share.totalCount=res?.data?.totalDataCount
        if(listType=='UP'){
     this.alltractorList = responsData;
        }else{
                 if (this.alltractorList?.length < this.share.totalCount) {
        this.alltractorList = [...this.alltractorList, ...responsData];
     }
        }
      
       this.putImage();
        this.traceTractorPosition();

    // if (responsData?.length > 30) {
    //   this.alltractorList = responsData.slice(0, 30);
    //   this.holddingList = responsData.slice(30, responsData?.length);
    // } else {
    //   this.alltractorList = responsData;
    //   this.holddingList = [];
    // }
        setTimeout(() => {
          this.share.spinner.dismiss('active_one');
        }, 0);

        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        takingTime = false;
    //    this.filterActiveAndFilterBy();

        //this.sortByFilter()

        //this.backupList = res.data;
      },
      (error: any) => {},
    );
}

  filterActiveAndFilterBy() {
    this.share.showLoading('Rendering Data', 2000);
    this.alltractorList = [];
    setTimeout(() => {
      let tractorList: any = [];
      if (this.listBy == 'ALL') {
        tractorList = JSON.parse(JSON.stringify(this.allTractorsSrcList));
      } else if (this.listBy == 'ARCHIVED') {
        tractorList = this.allTractorsSrcList.filter(
          (f: any) => f.tractor_status == 'ARCHIVED',
        );
      } else if (this.listBy == 'ACTIVE') {
        tractorList = this.allTractorsSrcList.filter(
          (f: any) => f.tractor_status != 'ARCHIVED',
        );
      }
      if (this.filterBy == 'ALL') {
        tractorList = tractorList;
      } else if (this.filterBy == 'SOLD') {
        tractorList = tractorList?.filter((f: any) => f?.isSold == 1);
      } else if (this.filterBy == 'NOT_SOLD') {
        // tractorList = tractorList?.filter(
        //   (f: any) =>
        //     f?.isSold == 0 &&
        //     (f?.getBookedStatus?.currentStatus != 'OPEN' ||
        //       !f?.getBookedStatus),
        // );
        tractorList = tractorList?.filter((f: any) => f?.isSold == 0);
      } else if (this.filterBy == 'BOOKED') {
        tractorList = tractorList?.filter(
          (f: any) =>
            f?.isSold == 0 && f?.getBookedStatus?.currentStatus == 'OPEN',
        );
      }
      if (this.filterBy == 'MAPPED') {
        tractorList = tractorList?.filter(
          (f: any) => f?.repairMappedData?.length > 0,
        );
      }
      if (this.filterBy == 'NOT_MAPPED') {
        tractorList = tractorList?.filter(
          (f: any) => f?.repairMappedData?.length == 0,
        );
      }
      if (this.filterBy == '0_IMAGE') {
        tractorList = tractorList?.filter(
          (f: any) => f?.imagesInTractor?.length == 0,
        );
      }
      if (this.filterBy == 'SOLD_TO_DEALER') {
        tractorList = tractorList?.filter((f: any) => f?.isSoldToDealer == 1);
      }
      if (this.filterBy == 'SOLD_NOT_TO_DEALER') {
        tractorList = tractorList?.filter((f: any) => f?.isSoldToDealer == 0);
      }
      if (this.filterBy == 'AT_WAREHOUSE') {
        tractorList = tractorList?.filter(
          (f: any) =>
            f?.isDraft == 1 &&
            f?.isLive == 1 &&
            f?.tractordetailadmin?.wareHouseLocation == null,
        );
      }

      this.sortByFilter(tractorList);
    }, 0);
  }
  holddingList:any=[]
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
      this.upper,
    );

    filteredList = this.share.filterByManuYear(filteredList, this.yearChecked);
    this.allFilterList = filteredList;
    if (filteredList?.length > 30) {
      this.alltractorList = filteredList.slice(0, 30);
      this.holddingList = filteredList.slice(30, filteredList?.length);
    } else {
      this.alltractorList = filteredList;
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
      checkedAll = true;
  selectedBrand: any = [];
  lower = 0;
  upper = 0;
  yearChecked = 'ALL';
    expandListEvent() {
   this.getDataByFilter(true,'DOWN')

    // this.share.presentToast('Expanding...');
    // setTimeout(() => {
    //   if (this.alltractorList?.length < this.allFilterList?.length) {
    //     this.alltractorList = [...this.alltractorList, ...this.holddingList];
    //   }
    // }, 0);

    // setTimeout(() => {
    
    // }, 0);
  }

  optionsArray = [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Active', value: 'ACTIVE' },
    { displayName: 'Archived', value: 'ARCHIVED' },
  ];

  async presentModal() {
    let showList = true;
    if (this.share.checkStoreOnlyAccess()) {
      showList = false;
    }
    const modal = await this.modalCtrl.create({
      component: SelectListTypeComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {
        filterBy: this.filterBy,
        listBy: this.listBy,
        showFilter: true,
        optionsArray: this.optionsArray,
        showList: showList,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    // if (data && data?.isFilterChange) {
    //   console.log('data', data);
    //   this.filterBy = data?.filterBy;
    //   this.sortByFilter()
    // }
    if (data && data?.isListChange) {
      console.log('data', data);
      this.listBy = data?.listBy;
      this.callListApi();
    }
    if (data && data?.isFilterChange) {
      console.log('data', data);
      this.filterBy = data?.filterBy;
      this.alltractorList = [];
      setTimeout(() => {
      //  this.sortByFilter();
      }, 0);
    }
  }

  refreshList() {
    this.getTractorList();
  }
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
  async salesOption(tractor: any) {
    debugger;
    const modal = await this.modalCtrl.create({
      component: FinanceOptionsComponent,
      cssClass: 'small-model',
      componentProps: {
        tractor: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
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
            //this.selectedBrand = this.brandList[0]?.id;
       
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

    this.alltractorList = [];
    this.api.postapi('getTractorListBranchWiseisLive', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        //this.sortByFilter();
        this.share.spinner.dismiss('active_four');
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
    this.alltractorList = [];
    this.api.postapi('getTractorListLive', obj).subscribe(
      (res: any) => {
        this.alltractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        //this.sortByFilter();
        this.share.spinner.dismiss('active_four');
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
 
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
                    this.share.putUnAssignedInWareHouse(this.warehouseList);
          this.share.putAllInWareHouse(this.warehouseList);
         
          console.log('this.warehouseList', this.warehouseList);
          if (!loader) {
          //  this.selectedStore = this.warehouseList[0]?.id;

            this.getDataByFilter(true);
          //  this.getAllTractorListStorewise();
            //   this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  callListApi() {
    if (this.listBy == 'ALL') {
      this.getAllTractorList();
    } else if (this.listBy == 'BRAND_WISE') {
      this.getTractorList(true);
    } else if (this.listBy == 'STORE_WISE') {
      this.getAllTractorListStorewise();
    }
  }
  isStoreOnlyAccess = false;

  // sortByFilter() {
  //   this.alltractorList = this.allTractorsSrcList.filter(
  //     (f: any) =>
  //       f?.isSold == 1 &&
  //       f?.sellingDetailedId &&
  //       f?.sellingDetailedIdDetails?.isFinance == 1 &&
  //       !f?.financeDetailedId
  //   );

  //   if (this.filterBy == 'ALL') {
  //     this.alltractorList = JSON.parse(JSON.stringify(this.alltractorList));
  //   } else if (this.filterBy == 'ARCHIVED') {
  //     this.alltractorList = this.alltractorList.filter(
  //       (f: any) => f.tractor_status == 'ARCHIVED'
  //     );
  //   } else if (this.filterBy == 'ACTIVE') {
  //     this.alltractorList = this.alltractorList.filter(
  //       (f: any) => f.tractor_status != 'ARCHIVED'
  //     );
  //   }
  // }
  // getAllTractorListStorewise(loader: any = false) {
  //   let staffDetails: any = this.share.get_staff();
  //   this.staffDetails = JSON.parse(staffDetails);
  //   if (!this.selectedStore) {
  //     this.selectedStore = this.warehouseList[0]?.id;
  //   }
  //   let obj = {
  //     operate: this.staffDetails?.staffCode,
  //     store_id: this.selectedStore,
  //   };
  //   //if (loader) {
  //   this.share.showLoading('Loading...');
  //   //}

  //   this.alltractorList = [];
  //   this.api.postapi('getTractorsListStoreWise', obj).subscribe(
  //     (res: any) => {
  //       this.alltractorList = res?.data;
  //       this.allTractorsSrcList = res?.data;
  //       // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

  //       //this.sortByFilter();
  //       this.share.spinner.dismiss();
  //       this.backupList = res.data;
  //     },
  //     (error: any) => {}
  //   );
  // }
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
  optionsUploadButtonArray: any = [];
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
          cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  keyList: any = [
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Is Sold ', value: 'isSold', type: 'CONDITIONAL' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  buttonArray: any = [
    {
      name: 'Add FinanceDetails',
      action: 'addFinanceDetails',
      image: './././assets/images/get-money.png',
    },
    {
      name: 'Sales Option',
      action: 'salesOption',
      image: './././assets/images/documentation.png',
    },
       {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
    },
    // {
    //   name: 'Sales Details',
    //   action: 'salesDetails',
    //   image: './././assets/images/resume.png',
    // },
        {
      name: 'View Booked Details',
      action: 'bookingViewMethod',
      image: './././assets/images/resume.png',
    },
      {
      name: 'Payout Details',
      action: 'payoutDetails',
      image: './././assets/images/saving.png',
    },
    
  ];

  async actionEventCall(e: any) {
    // console.log('actionEventCall', e);
    // if (e?.button?.name == 'Add FinanceDetails') {
    //   this.addFinanceDetails(e?.tractor);
    // } else if (e?.button?.name == 'Sales Option') {
    //   this.salesOption(e?.tractor);
    // }
    // else if (e?.button?.name == 'Sales Details') {
    //   this.salesDetails(e?.tractor);
    // }
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: this.optionsUploadButtonArray,
    });

    if (this.commonMethod.reloadMethod) {
      this.callListApi();
    }
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
