import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  tractorDetails: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  totalPaymentDone: any = 0;
  dealearPrice: any = 0;
  remainigPayment: any = 0;
  transactionData: any = [];
  previousAmount:any=0
  staffDetails:any
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.dealearPrice = Number(this?.tractorDetails?.dealerPrice || 0);
    if(this.transactionData?.length){
      this.previousAmount=this.transactionData[0]?.amount
    }
    this.initialize();
    this.countPayment();
  }
  countPayment() {
    this.transactionData?.forEach((f: any) => {
      this.totalPaymentDone = this.totalPaymentDone + Number(f?.amount);
    });
    this.remainigPayment = this.dealearPrice - this.totalPaymentDone;
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  form: FormGroup;
  data: any;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      previous_amount: new FormControl(data?.previous_amount || this.previousAmount ||0, [
        Validators.required,
      ]),
      total_amount: new FormControl(data?.dealerPrice || 0, [
        Validators.required,
      ]),
      // remaining_amount: new FormControl(data?.remaining_amount || null, [
      //   Validators.required,
      // ]),
      dealerPrice: new FormControl(this?.tractorDetails?.dealerPrice || 0, [
        Validators.required,
      ]),
      amount: new FormControl(data?.amount || null, [Validators.required]),
      actionById: new FormControl(this.staffDetails?.id || null, [Validators.required]),
      transaction_head: new FormControl(data?.transaction_head || null, [Validators.required]),
      tractor_id: new FormControl(this.tractorDetails?.id || null, [
        Validators.required,
      ]),
      store_id: new FormControl(
        this?.tractorDetails?.tractordetailadmin?.wareHouseLocation || null,
        [Validators.required]
      ),
      transaction_date: new FormControl(data?.transaction_date || null,[Validators.required]),
    });
    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  addTransaction() {
    if (this.form.valid) {
      let objVal:any=this.form.value
      if (this.form.controls['amount'].value <= this.remainigPayment) {
        objVal.billNumber='TF-'+Math.floor(100000 + Math.random() * 900000)
        objVal.remaining_amount=this.dealearPrice-(this.totalPaymentDone+Number(this.form.controls['amount'].value))
        let obj = {
          src: 'tractor_transaction',
          data: objVal,
        };
        this.share.showLoading('Saving...');
        this.api.postapi('addOpp', obj).subscribe((res: any) => {
          this.share.spinner?.dismiss();
          this.share.presentToast('Saved Successfully...');
        
          this.modalCtrl.dismiss('confirm');
        });
      } else {
        this.share.presentToast('Amount is greater than remaining amount');
      }
    }else{
      this.share.presentToast('Please fill required fields');
    }
  }
}
