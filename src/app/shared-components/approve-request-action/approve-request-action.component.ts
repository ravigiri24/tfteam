import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-approve-request-action',
  templateUrl: './approve-request-action.component.html',
  styleUrls: ['./approve-request-action.component.scss'],
})
export class ApproveRequestActionComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
  ) {}
  @Input() listColorClass = 'sixColor';
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
  selectedStore: any;
  approval: any;
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails, this.approval);
    this.staffDetails = JSON.parse(staffDetails);

    this.initialize(this.approval);
  }
  staffDetails: any;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      approvedBy: new FormControl(this?.staffDetails?.id, [
        Validators.required,
      ]),
      actionTaken: new FormControl(true, [Validators.required]),
      approveactionDate: new FormControl(null, [Validators.required]),
      apporveRemark: new FormControl(null, []),
      isApproved: new FormControl(true, [Validators.required]),
    });
  }
  modelName: any;
  enquiry: any;
  action() {
    if (this.form.valid) {
      let objVal = this.form.value;

      let obj = {
        src: 'approvalfortractor',
        data: objVal,
        id: this.approval?.id,
      };
      this.share.showLoading('Action Taking');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        if (this.form.value?.isApproved == true) {
          let description =
            this.staffDetails?.name +
            ' has approved the request for ' +
            this.approval?.tractor_name +
            ' at ' +
            this.approval?.approvePrice +
            ' for ' +
            this.approval?.storeName;
          this.api.genreteEnquiry(
            'Request Approved',
            description,
            { store_id: this.approval?.storeId },
            this.staffDetails,
          );
          this.bookedTractor();
        } else {
          let description =
            this.staffDetails?.name +
            ' has rejected the request for ' +
            this.approval?.tractor_name +
            ' at ' +
            this.approval?.approvePrice +
            ' for ' +
            this.approval?.storeName;
          this.api.genreteEnquiry(
            'Request Rejected',
            description,
            { store_id: this.approval?.storeId },
            this.staffDetails,
          );
          this.share.presentToast('Action Done Successfully...');
        }

        this.share.spinner.dismiss();

        this.modalCtrl.dismiss(true);
      });
    } else {
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  bookedTractor() {
    this.share.showLoading('Booking...');

    let today = new Date();
    let objVal: any = {
      customerName: this.approval?.customerName,
      mobileNo: this.approval?.mobileNo,
      village: this.approval?.village,
      state_id: this.approval?.state_id,
      city_id: this.approval?.city_id,
      deal_price: this.approval?.approvePrice,
      booking_price: this.approval?.booking_price,
      currentStatus: 'OPEN',
      booking_date: today,
      sale_type: this.approval?.sale_type,
      expectedDateForSale: this.approval?.expectedDateOfSale,
      remark: this.form?.value?.apporveRemark,
      actionByid: this?.staffDetails?.id,
      tractor_id: this.approval?.tractor_id,
      store_id: this.approval?.storeId,
      approve_id: this.approval?.id
    };
    if (
      this.approval?.tractor_id &&
      this.approval?.storeId &&
      this.approval?.actionByid &&
      this.approval?.approvePrice
    ) {
      let obj = {
        src: 'booking_history',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe(
        (res: any) => {
          this.share.presentToast('Booking Confirm');
          this.share.spinner.dismiss();
          //  this.modalCtrl.dismiss(true);
          this.share.presentToast(
            'Approved,Your Tractor Has Been Successfully Booked.',
          );
        },
        (error: any) => {},
      );
    } else {
      this.share.presentToast('Approved,But Not Booked');
    }
  }

  toggleChanged(e: any) {
    console.log('e', e);
    if (e?.detail?.checked == true) {
    } else {
      this.modelName = null;
      this.form.controls['bookedModel'].setValue(null);
      this.form.controls['willBuyDate'].setValue(null);
      this.form.controls['bookedDate'].setValue(null);
    }
  }
}
