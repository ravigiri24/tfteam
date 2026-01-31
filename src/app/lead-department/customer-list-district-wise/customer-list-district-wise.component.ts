import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { SearchCustomerComponent } from 'src/app/customer-management/search-customer/search-customer.component';

import { ReviewPageComponent } from 'src/app/customer-management/review-page/review-page.component';
import { ViewCustomerDataComponent } from 'src/app/customer-management/view-customer-data/view-customer-data.component';
import { CustomerDashboardComponent } from 'src/app/customer-management/customer-dashboard/customer-dashboard.component';

import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-customer-list-district-wise',
  templateUrl: './customer-list-district-wise.component.html',
  styleUrls: ['./customer-list-district-wise.component.scss'],
})
export class CustomerListDistrictWiseComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  constructor(
    private share: ShareService,
    private api: ApiService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router,
    private commonMethod: CommonMethodService,
  ) {}

  @ViewChild(IonContent) content: IonContent;
  nextScheduleForm: FormGroup;
  scrollToTop() {
    this.content.scrollToTop(0);
  }
  showData = true;
  staffDetails: any;
  async searchCustomer() {
    const modal = await this.modalController.create({
      component: SearchCustomerComponent,
      componentProps: {
        buttonArray: this.buttonArray,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  selectedDistrict: any;
  cityList: any = [];
  getAllTractorListDistricwise() {
    this.getCustomerList();
  }

  stateList: any = [];
  staff_ids: any = [];
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
 this.staff_ids=[]
    this.staffDetails = JSON.parse(staffDetails);
    this.customerList = [];
    this.showData = false;
    this.selectedDistrict = null;
    if (this.share.checkStaffTypeForLeadManagement(this.staffDetails)) {
      this.staffDetails?.allotedStore?.forEach((f: any) => {
        this.staff_ids.push(f?.staff_id);
      });
    }else{
         this.staff_ids.push(this.staffDetails?.id)
    }
    setTimeout(() => {
      this.content.scrollToTop(0).then(() => {
        this.getDistrictList(true);

        this.getStaffList();
      });
    }, 0);

    setTimeout(() => {}, 0);
  }
  districtList: any = [];
  districtListSrc: any = [];
  getDistrictList(selectDistrict: any = false) {
    this.districtList = [];
    let obj: any = this.share.getStaffObj();
    obj.staff_id = this.staff_ids;
    this.share.showLoading('Loading');
    this.api.postapi('getAllotedDistrictList', obj).subscribe(
      (res: any) => {
        this.districtList = res?.data;
        if (selectDistrict) {
          this.selectedDistrict = this.districtList[0]?.district_id;
        }
        this.getCustomerList(false);

        //    this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    console.log('CustomerManagementComponent');

    //this.getCustomerList()
  }
  districtmgmt() {
    this.router.navigate([
      '/digital/district-mgmt',
      '/digital/customer-management',
    ]);
  }
  followLoader: any = false;
  nextFollowupDate() {
    if (this.nextScheduleForm.valid) {
      this.followLoader = true;
      let obj = {
        src: 'customer_lead_chats',
        data: this.nextScheduleForm.value,
      };
      this.showLoading('Scheduling ...');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.followLoader = false;
        this.spinner?.dismiss();
        this.presentToast('Scheduled Successfully...');
        this.nextScheduleForm.controls['status'].reset();
      });
    }
  }
  initializeNextDate(customer: any) {
    this.nextScheduleForm = this.fb.group({
      next_lead_date: new FormControl(null, [Validators.required]),
      customer_id: new FormControl(customer?.id || null, [Validators.required]),
      chat_type: new FormControl('FOLLOW_UP_DATE', [Validators.required]),
      employeId: new FormControl(this.staffDetails?.staffCode || null, [
        Validators.required,
      ]),
    });

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  number = 50;
  onIonInfinite(ev: any) {
    console.log('onIonInfinite', ev);
    // let number=50*(Number(ev?.eventPhase)+1)+50
    // let indi=Number(this.customerList.length)+1

    // for (let index = indi; index < number; index++) {
    //  this.customerList.push(this.customerListOrg[index])

    // }
    if (this.showData) {
      let firstIndex = this.customerList.length;
      let lastIndex = firstIndex + 51;
      this.getCustomerList();
    } else {
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent)?.target?.complete();
      }, 0);
    }
    // for (let index = firstIndex; index < lastIndex; index++) {
    //   this.customerList.push(this.customerListOrg[index])

    //  }

    // setTimeout(() => {
    //   (ev as InfiniteScrollCustomEvent).target.complete();
    // }, 0);
  }
  search: any;
  spinner: any;
  async showLoading(message: any) {
    this.spinner = await this.loadingCtrl.create({
      message: message,
      duration: 5000,
    });

    this.spinner.present();
  }

  modelType = 'CUSTOMER';
  customerList: any = [];
  showAddComp = true;
  handleRefresh(e: any) {
    // this.scrollToTop()
    // setTimeout(() => {
    //   this.getCustomerList(e,0,50,null,true)
    // }, 0);
    this.showData = false;
    setTimeout(() => {
      this.content.scrollToTop(0).then(() => {
        this.getCustomerList();
      });
    }, 0);
  }
  refreshList() {
    this.showData = false;
    setTimeout(() => {
      this.content.scrollToTop(0).then(() => {
        this.getCustomerList();
      });
    }, 0);
  }
  editIndex: any;
  openEdit(cus: any, editIndex: any) {
    this.modelType = 'CUSTOMER';
    this.editIndex = editIndex;
    document.getElementById('open-modal')?.click();
    this.editData = cus;
    this.showAddComp = false;
    setTimeout(() => {
      this.showAddComp = true;
    }, 0);
  }
  customerSelected: any;
  nextScheduleDate: any;
  setDate(v: any) {
    console.log('setDate', this.nextScheduleForm.value, v);
  }
  nextSchedule() {
    console.log('nextSchedule', this.nextScheduleForm.value);
  }

  addReview(cus: any, editIndex: any) {
    this.customerSelected = cus;
    this.showRemark = false;
    setTimeout(() => {
      this.showRemark = true;
    }, 0);
    this.initializeNextDate(cus);
    document.getElementById('open-modal')?.click();
    this.modelType = 'REVIEW';
  }
  nextFollowup(cus: any, editIndex: any) {
    this.initializeNextDate(cus);
    this.customerSelected = cus;

    document.getElementById('open-modal')?.click();
    this.modelType = 'FOLLOW-UP';
  }
  viewDetails(cus: any, editIndex: any) {
    this.customerSelected = cus;
    document.getElementById('open-modal')?.click();
    this.modelType = 'VIEW-DATA';
  }
  updateList(e: any) {
    if (this.editData) {
      e.followUpDate = this.editData?.followUpDate;
      e.leadsChat = this.editData?.leadsChat;

      this.customerList[this.editIndex] = e;
    } else {
      this.customerList.unshift(e);
    }
  }
  async actionEventCall(e: any) {
    // if(e?.button?.name=='Edit Customer'){
    //   this.addCustomer(e?.customer,e?.index)
    // }else{
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });
    //}
  }
  listColorClass = 'firstColor';
  showRemark: any = true;
  staffList: any = [];
  getStaffList() {
    let obj: any = this.share.getListObj('staffdetails', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    this.api.postapi('getStaffByStoreId', obj).subscribe((res: any) => {
      this.staffList = res?.data;
    });
  }
  digital: any = 0;
  online: any = 0;
  visitors: any = 0;
  customerListOrg: any = [];
  getCustomerList(loader: any = true) {
    let obj: any = this.share.getStaffObj();
    obj.district_id = this.selectedDistrict;
    this.customerList = [];
    if (loader) {
      this.share.showLoading('Loading Data');
    }

    this.api.postapi('getCustomerListByDistrict', obj).subscribe(
      (res: any) => {
        this.showData = true;

        res?.data?.forEach((element: any) => {
          this.customerList.push(element);
        });

        this.customerList.sort(function (a: any, b: any) {
          return b.id - a.id;
        });
        this.share.spinner.dismiss();
        console.log('  this.customerList', this.customerList);
        // this.customerListOrg = JSON.parse(JSON.stringify(res.data));
        // this.customerList = JSON.parse(JSON.stringify(res.data))
        // this.customerList.splice(50);

        // this.digital=this.customerList.filter((f:any)=>f?.customerType=='DIGITAL')?.length
        // this.online=this.customerList.filter((f:any)=>f?.customerType=='ONLINE')?.length
        // this.visitors=this.customerList.filter((f:any)=>f?.customerType=='VISITORS')?.length
        this.share.spinner?.dismiss('active_one');

        console.log('getCustomerListByStore', this.customerList);
      },
      (error: any) => {},
    );
  }
  buttonArray: any = [
    {
      name: 'Edit Customer',
      action: 'editCustomer',
      image: './././assets/images/edit.png',
    },
    {
      name: 'Customer Remark',
      action: 'customer_review',
      image: './././assets/images/comments.png',
    },
    {
      name: 'Customer View',
      action: 'customer_view',
      image: './././assets/images/data.png',
    },
  ];
  editData: any;
  dataClear() {
    this.modelType = 'CUSTOMER';
    this.editData = null;
    this.showAddComp = false;
    setTimeout(() => {
      this.showAddComp = true;
    }, 0);
  }
  async addRemark(customer: any = null) {
    const modal = await this.modalController.create({
      component: ReviewPageComponent,
      componentProps: {
        customer: customer,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
  async viewCustomer(customer: any = null) {
    const modal = await this.modalController.create({
      component: ViewCustomerDataComponent,
      componentProps: {
        customerSelected: customer,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
  // async addCustomer(editData:any=null,editIndex:any=null){
  //   this.editIndex = editIndex;
  //   this.editData=editData
  //       const modal = await this.modalController.create({
  //         component: AddCustomerPopUpComponent,
  //         componentProps: {
  //          editData: editData,
  //         },
  //       });
  //       await modal.present();
  //       const { data, role } = await modal.onWillDismiss();
  //       console.log('role', role);
  //       if(data){
  //       this.updateList(data)
  //       }

  // }
  async viewDashboard(editData: any = null, editIndex: any = null) {
    this.editIndex = editIndex;
    this.editData = editData;
    const modal = await this.modalController.create({
      component: CustomerDashboardComponent,
      componentProps: {
        editData: editData,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if (data) {
      this.updateList(data);
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  name: any;
  message: any;
  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}
