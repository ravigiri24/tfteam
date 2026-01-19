import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

import { CommonMethodService } from 'src/app/common-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationPopUpComponent } from 'src/app/shared-components/notification-pop-up/notification-pop-up.component';
import { OpenNotificationAlertComponent } from 'src/app/shared-components/open-notification-alert/open-notification-alert.component';
import { ReviewPageComponent } from 'src/app/customer-management/review-page/review-page.component';
@Component({
  selector: 'app-enquiry-list-tarritory-manager',
  templateUrl: './enquiry-list-tarritory-manager.component.html',
  styleUrls: ['./enquiry-list-tarritory-manager.component.scss'],
})
export class EnquiryListTarritoryManagerComponent  implements OnInit {

 constructor(
    public share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private commonMethod: CommonMethodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  listColorClass = 'sixColor';
  ngOnInit() {}
  
  enquireList: any = [];
  headerDisplayArray = [
    
     { name: 'Notification', icon: 'notifications-outline',type:'NOTIFICATION' },
  ];

  actionEventHeader(e: any) {
    if (e?.name == 'Notification') {
     this.openNotidication()
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
  async actionEventCall(e: any) {
    if (
      e?.button?.name == 'Customer Remark' ||
      e?.button?.name == 'Customer View'
    ) {
      let obj = {
        button: e?.button,
        index: e?.index,
        customer: {
          id: e?.customer?.customer_id,
          name: e?.customer?.customerName,
        },
      };
      await this.commonMethod.actionEventCall(obj, {
        optionsUploadButtonArray: [],
      });
    } else {
      await this.commonMethod.actionEventCall(e, {
        optionsUploadButtonArray: [],
      });
    }

    if (this.commonMethod.reloadMethod) {
      this.getEnquirList();
    }
  }
  isModalOpen=false
   
   
  tractorListStorewise(e: any) {
    this.selectedStore = e?.selectedStore;
    this.getEnquirList();
  }
  warehouseList: any = [];
  selectedStore: any;
  allotedWareHouse: any = [];
  getWareHouseList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;
    if(loader){
this.share.showLoading('Loading...');
    }
    
    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();
          let allotedStore = this.storesList;
          let warehouseList: any = [];
          this.warehouseList?.forEach((ware: any) => {
            let checkIn = allotedStore?.find(
              (store: any) => store.store_id == ware?.id
            );
            if (checkIn) {
              let findI = this.warehouseList?.findIndex(
                (wareIn: any) => wareIn?.id == ware?.id
              );
              warehouseList.push(ware);
            }
          });
          warehouseList.unshift({ id: 'ALL', name: 'All' });
          this.allotedWareHouse = warehouseList;
          console.log('this.warehouseList', this.warehouseList);
          if (!loader) {
            if (this.allotedWareHouse?.length) {
              this.selectedStore = this.allotedWareHouse[1]?.id;
            }
            this.getEnquirList();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  allFilterList: any = [];
  holddingList: any = [];
  expandListEvent() {
    //  this.share.showLoading("Rendering Data...")
    this.share.presentToast('Expanding...');
    setTimeout(() => {
      if (this.enquireList?.length < this.allFilterList?.length) {
        this.enquireList = [...this.enquireList, ...this.holddingList];
      }
    }, 0);

    setTimeout(() => {
      //this.share.spinner.dismiss()
    }, 0);
  }
  buttonArray: any = [
    {
      name: 'View Enquiry',
      action: 'customer_view',
      image: './././assets/images/visual.png',
    },
    {
      name: 'Customer Remark',
      action: 'customer_review',
      showScheduleRamrk: false,
      image: './././assets/images/comments.png',
    },
    {
      name: 'Customer View',
      action: 'customer_view',
      showActionsButton: false,
      image: './././assets/images/data.png',
    },
  ];
  getEnquirList() {
    this.enquireList = [];
    let obj: any = this.share.getStaffObj();
    if (this.selectedStore != 'ALL') {
      obj.storeId = [this.selectedStore];
    } else {
      let all: any = [];
      this.allotedWareHouse?.forEach((f: any) => {
        if (f?.id != 'ALL') {
          all.push(f?.id);
        }
      });
      obj.storeId = all;
    }

    if (this.selectedItem == 'OPEN_ENQUIRE') {
      obj.enquiryType = true;
    } else if (this.selectedItem == 'CLOSED_ENQUIRE') {
      obj.enquiryType = false;
    } else {
      obj.enquiryType = true;
    }

    this.share.showLoading('Loading...');
    this.api.postapi('get_customers_enquire', obj).subscribe(
      (res: any) => {
        this.allFilterList = res?.data;
        if (res?.data?.length > 20) {
          this.enquireList = res?.data?.slice(0, 20);
          this.holddingList = res?.data?.slice(20, res.data?.length);
        } else {
          this.enquireList = res?.data;
          this.holddingList = [];
        }
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }

  async addRemark(customer: any = null) {
    const modal = await this.modalCtrl.create({
      component: ReviewPageComponent,
      componentProps: {
        customer: customer,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
  srcPage: any;

  staffDetails: any;
  callNotification=false
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
       this.staffDetails = JSON.parse(staffDetails);
    this.allFilterList = [];
    this.holddingList = [];
    this.enquireList = [];
 
    //    this.activatedRoute.params.subscribe((params: any) => {
    //    this.selectedItem = 'params?.type;'
    //  this.srcPage= params?.srcPage;
    //  });
    this.selectedItem = 'OPEN_ENQUIRE';
    //setTimeout(() => {
  //this.api.generateNotifcationToAboveStaff({id:2},this.staffDetails)
  
    let obj: any = this.share.getStaffObj();
   obj.staff_id=this.staffDetails?.id
 this.api.checkNotification(obj)
    
 
  
   
    this.getAllotStoreToAssignStaff();
    // this.getAllotStoreToAssignStaff()
  }

  storesList: any = [];
  getAllotStoreToAssignStaff() {
    this.enquireList = [];
    let obj: any = this.share.getStaffObj();

    //obj.staff_id = this.staffDetails?.id;
    obj.staff_id = this.share?.getStaffCloneId(this.staffDetails);
    
    this.share.showLoading('Loading...');
    this.api.postapi('getAllotedToStaffStore', obj).subscribe(
      (res: any) => {
        this.storesList = res.data;
      //  this.share?.spinner?.dismiss();
        this.getWareHouseList();
      },
      (error: any) => {}
    );
  }
  optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    this.getEnquirList();
  }
  selectedItem = 'OPEN_ENQUIRE';
  optionsArray: any = [
    {
      id: 'OPEN_ENQUIRE',
      name: 'Open',
    },
    {
      id: 'CLOSED_ENQUIRE',
      name: 'Closed',
    },
  ];

}
