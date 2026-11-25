import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { AddNewFindingsComponent } from 'src/app/purchase-management/new-findings/add-new-findings/add-new-findings.component';
import { CostPredictionComponent } from 'src/app/purchase-management/cost-prediction/cost-prediction.component';
import { FindingFilterComponent } from 'src/app/shared-components/finding-filter/finding-filter.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-booking-tracker',
  templateUrl: './booking-tracker.component.html',
  styleUrls: ['./booking-tracker.component.scss'],
  providers: [DatePipe],
})
export class BookingTrackerComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    public share: ShareService,
    private api: ApiService,
    private commonMethod: CommonMethodService,
    private datePipe: DatePipe,
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ) {}

  ngOnInit() {}

  async openBookingList(store?: { storeId: string; storeName: string }) {
    const bookings = store === undefined ? this.bookingList : this.bookingList.filter((booking: any) =>
      String(booking?.store_id ?? booking?.storeName ?? 'unknown') === store.storeId
    );
    const modal = await this.modalCtrl.create({
      component: BookingListComponent,
      cssClass: 'modal-xl',
      componentProps: {
        bookings,
        title: store === undefined ? 'All Bookings' : `${store.storeName} Bookings`,
        listColorClass: this.listColorClass,
      },
    });
    await modal.present();
  }
srcPage:any
  ionViewWillEnter() {
    this.newFindingList = [];
       this.selectedItem = 'ALL'
           this.warehouselocation()
    this.resetFilterVal()
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });

        this.getBrandList();
    // this.getTractorList();
    // this.getOldTractorList()

    console.log("Deal",this.deal);
    
  }

  yearChecked = 'ALL';

  checkedAll = true;

  resetFilterVal() {
    this.checkedAll = true;
    this.selectedBrand = [];
    this.allFilterList = [];

    this.yearChecked = 'ALL';
  }

  async showModal(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddNewFindingsComponent,
      cssClass: 'modal-dark-backdrop',
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
          this.hadAction=true
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

  deal:any

  staffDetails: any;

  newFindingList: any = [];
assingedStaff:any=[]
  newFindingListSrc: any = [];
  getAssignedList(){
      this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_id=this.selectedItem
    setTimeout(() => {
      this.api.postapi('getAssignedStaff', obj).subscribe(
        (res: any) => {
          this.assingedStaff = res?.data;
          console.log("getAssignedList",this.assingedStaff );
          let store_idsArray:any=[]
        this.assingedStaff.forEach((f:any)=>{
store_idsArray.push(f?.staff_id)
        })
  this.getBookingList(store_idsArray)
        },
        (error: any) => {}
      );
    }, 0);
  }
bookingList:any=[]
  staffWiseStores: Record<string, (string | number)[]> = {};
  storeBookingSummary: { storeId: string; storeName: string; totalBookings: number }[] = [];
  totalBookings = 0;
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
  updateStoreBookingSummary() {
    const storesById = new Map<string, string>();
    (this.storeList || []).forEach((store: any) => {
      storesById.set(String(store.id), store.name || store.storeName);
    });
    const bookingsByStore = new Map<string, { storeName: string; totalBookings: number }>();
    if (this.selectedItem === 'ALL') {
      storesById.forEach((storeName, id) => {
        bookingsByStore.set(id, { storeName, totalBookings: 0 });
      });
    }
    Object.values(this.staffWiseStores).forEach((storeIds) => {
      if (!Array.isArray(storeIds)) {
        return;
      }
      storeIds.forEach((storeId) => {
        const id = String(storeId);
        bookingsByStore.set(id, {
          storeName: storesById.get(id) || `Store ${id}`,
          totalBookings: 0,
        });
      });
    });
    this.bookingList.forEach((booking: any) => {
      const id = String(booking?.store_id ?? booking?.storeName ?? 'unknown');
      const store = bookingsByStore.get(id) || {
        storeName: storesById.get(id) || booking?.storeName?.trim() || 'Unknown Store',
        totalBookings: 0,
      };
      store.totalBookings += 1;
      bookingsByStore.set(id, store);
    });
    this.storeBookingSummary = Array.from(bookingsByStore.entries(), ([storeId, store]) => ({ storeId, ...store }))
      .sort((a, b) => a.storeName.localeCompare(b.storeName));
    this.totalBookings = this.bookingList.length;
  }
  storeList:any
    warehouselocation() {
    this.storeList = [];
    let obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.storeList = res?.data;
        this.getStaffList()
      },
      (error: any) => {}
    );
  }
  getBookingList(store_idsArray:any){
   
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.store_idsArray=store_idsArray
    setTimeout(() => {
      this.api.postapi('getBookingListActive', obj).subscribe(
        (res: any) => {
          const data = res?.data ?? res;
          this.bookingList = Array.isArray(data?.bookingList) ? data.bookingList : [];
          this.staffWiseStores = data?.staffWiseStores || {};
          this.updateStoreBookingSummary();
       
      
     this.share.spinner.dismiss('active_one')
        },
        (error: any) => {}
      );
    }, 0);
  }
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      type:this.selectedItem,
      deal_id:this.deal?.id
    };
    this.share.showLoading(msg);
    this.api.postapi('getBookinngBYTm', obj).subscribe(
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

  optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    if(this.selectedItem=='ALL'){
      this.getBookingList('ALL')

    }else{
 this.getAssignedList();
    }
   
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

  hadAction=false

  listColorClass = 'secondColor';

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
         else if (e?.name == 'Back') {
   this.backToDashboard()
    }
    
    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }
  }


  searchTractor() {}

  headerDisplayArray = [
    { name: 'Back', icon: 'arrow-back-outline' },
    
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
            this.hadAction=true
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

  selectedItem = 'ALL';

  optionsArray: any = [{ id: 'ALL', name: 'All' }];

  getStaffList() {
    const staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    const obj: any = this.share.getListObj('staffList', false, [], true);
    obj.staff_role = 'TERRITORY_MANAGER';
    obj.staff_id = this.staffDetails?.id;

    this.api.postapi('getStaffListRoleWise', obj).subscribe(
      (res: any) => {
        this.optionsArray = [
          { id: 'ALL', name: 'All' },
          ...(res?.data || []),
        ];
        this.selectedItem=this.optionsArray[1]?.id
        this.getAssignedList()
      },
      (error: any) => {},
    );
  }

}
