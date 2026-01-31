import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ViewCustomerDataComponent } from 'src/app/customer-management/view-customer-data/view-customer-data.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-customer-list-follow-up',
  templateUrl: './customer-list-follow-up.component.html',
  styleUrls: ['./customer-list-follow-up.component.scss'],
})
export class CustomerListFollowUpComponent  implements OnInit {
 @ViewChild(IonModal) modalFollow: IonModal;
  constructor(
    private api: ApiService,
    public share: ShareService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private commonMethod:CommonMethodService
  ) {}
  date: any;
  staffDetails: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.date = yyyy + '-' + mm + '-' + dd;
    this.staff_ids=[]
   if (this.share.checkStaffTypeForLeadManagement(this.staffDetails)) {
      this.staffDetails?.allotedStore?.forEach((f: any) => {
        this.staff_ids.push(f?.staff_id);
      });
    }else{
         this.staff_ids.push(this.staffDetails?.id)
    }
    this.getDistrictList();
  }
  staff_ids:any=[]
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
  customerSelected: any;
  showRemark = true;
  cancel() {
    this.modalFollow.dismiss(null, 'cancel');
  }
  show = false;
  addReview(cus: any, editIndex: any) {
    this.customerSelected = cus?.customerDetails;
    this.showRemark = false;
    setTimeout(() => {
      this.showRemark = true;
    }, 0);
    this.initializeNextDate(cus?.customerDetails);
    document.getElementById('open-modal-follow')?.click();
  }
  followLoader: any = false;
  nextFollowupDate() {
    if (this.nextScheduleForm.valid) {
      this.followLoader = true;
      let obj = {
        src: 'customer_lead_chats',
        data: this.nextScheduleForm.value,
      };
      this.share.showLoading('Scheduling ...');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.followLoader = false;
        this.share.spinner?.dismiss('active_two');
        this.share.presentToast('Scheduled Successfully...');
        this.nextScheduleForm.controls['status'].reset();
      });
    }
  }
  message: any;
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  nextScheduleForm: FormGroup;
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
  followUpList: any = [];
  ngOnInit() {}
  refreshList() {
    this.getFollowList();
    setTimeout(() => {
      this.cancel();
    }, 0);
  }
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });
  }
    listColorClass='secondColor'
  buttonArray: any = [

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
    districtList: any = [];
  districtListSrc: any = [];
  getDistrictList(selectDistrict: any = false) {
    this.districtList = [];
    let obj: any = this.share.getStaffObj();
    //obj.staff_id = this.staffDetails?.id;
    obj.staff_id = this.staff_ids;
    this.share.showLoading("Loading")
    this.district_ids=[]
    this.api.postapi('getAllotedDistrictList', obj).subscribe(
      (res: any) => {
        this.districtList = res?.data;
      this.districtList.forEach((f:any)=>{
        this.district_ids.push(Number(f?.district_id))
      })
        this.getFollowList();

        //    this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  search: any;
  showData = true;
  loader = false;
  customerList: any = [];
  district_ids: any = [];
  getFollowList() {
    this.loader = true;
    let obj: any = this.share.getListObj('customerdetails', false, [], true);
    obj.date = this.date;
    obj.district_ids = this.district_ids;
    //this.share.showLoading('Loading...');
    this.customerList = [];
    this.api.postapi('getFollowupListDistrictWise', obj).subscribe(
      (res: any) => {
        this.followUpList = res.data;
        res?.data?.forEach((f: any) => {
          this.customerList.push(f?.customerDetails);
        });
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        console.log('followUpList', this.followUpList);
        this.share?.spinner?.dismiss('active_two');
        this.loader = false;
      },
      (error: any) => {
        this.loader = false;
      }
    );
  }
}
