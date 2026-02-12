import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';

import { CommonMethodService } from 'src/app/common-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationPopUpComponent } from 'src/app/shared-components/notification-pop-up/notification-pop-up.component';
import { ReviewPageComponent } from 'src/app/customer-management/review-page/review-page.component';
@Component({
  selector: 'app-tarritory-manager-approval-list',
  templateUrl: './tarritory-manager-approval-list.component.html',
  styleUrls: ['./tarritory-manager-approval-list.component.scss'],
})
export class TarritoryManagerApprovalListComponent  implements OnInit {

  constructor(
    public share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private commonMethod: CommonMethodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  listColorClass = 'firstColor';
  ngOnInit() {}
  enquireList: any = [];
  headerDisplayArray = [
        
     { name: 'Notification', icon: 'notifications-outline',type:'NOTIFICATION' },
  ];
  actionEventHeader(e: any) {
    if (e?.name == 'Back') {
      this.router.navigate([this.srcPage]);
    }
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
  approvalList: any = [];
  getingApprovalList() {
    let obj: any = this.share.getStaffObj();
    obj.requestBy = this.staffDetails?.id;

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
    obj.type = this.selectedItem;
    this.approvalList = [];
    this.share.showLoading('Getting Data...');
    this.api.postapi('getApporvalList', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.approvalList = res?.data;
      this.allFilterList=res?.data
      if (res?.data?.length > 10) {
        this.approvalList = res?.data?.slice(0, 10);
        this.holddingList = res?.data?.slice(10, res.data?.length);
      } else {
        this.approvalList = res?.data;
        this.holddingList = [];
      }
    });
  }

  listStorewise(e: any) {
    this.selectedStore = e?.selectedStore;
    this.getingApprovalList();
  }
  warehouseList: any = [];
  selectedStore: any;
  allotedWareHouse: any = [];
  getWareHouseList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;
    this.share.showLoading('Loading...');
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
            this.getingApprovalList();
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
      if (this.approvalList?.length < this.allFilterList?.length) {
        this.approvalList = [...this.approvalList, ...this.holddingList];
      }
    }, 0);

    setTimeout(() => {
      //this.share.spinner.dismiss()
    }, 0);
  }
  


  srcPage: any;

  staffDetails: any;
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
    this.selectedItem = 'PENDING';
    this.getAllotStoreToAssignStaff();
    // this.getAllotStoreToAssignStaff()
      let obj: any = this.share.getStaffObj();
   obj.staff_id=this.staffDetails?.id
 this.api.checkNotification(obj)
  }
  storesList: any = [];
  getAllotStoreToAssignStaff() {
    this.enquireList = [];
    let obj: any = this.share.getStaffObj();

    obj.staff_id =this.share?.getStaffCloneId(this.staffDetails);

    this.share.showLoading('Loading...');
    this.api.postapi('getAllotedToStaffStore', obj).subscribe(
      (res: any) => {
        this.storesList = res.data;
        this.share?.spinner?.dismiss();
        this.getWareHouseList();
      },
      (error: any) => {}
    );
  }
  optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    this.getingApprovalList();
  }
  selectedItem = 'PENDING';
  optionsArray: any = [
    {
      id: 'PENDING',
      name: 'Pending',
    },
    {
      id: 'APPROVED',
      name: 'Approved',
    },
    {
      id: 'REJECTED',
      name: 'Rejected',
    },
    {
      id: 'ALL',
      name: 'All',
    },
  ];

}
