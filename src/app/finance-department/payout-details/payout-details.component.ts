import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { UpdatePayoutPercentComponent } from './update-payout-percent/update-payout-percent.component';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-payout-details',
  templateUrl: './payout-details.component.html',
  styleUrls: ['./payout-details.component.scss'],
})
export class PayoutDetailsComponent implements OnInit {
  tractorDetails: any;
  @Input() listColorClass: any = 'fourthColor';
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
  ) {}
  dismiss() {
    this.modalControl.dismiss();
  }
  staffDetails: any;
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    if (this.tractorDetails?.financeDetailedId) {
      this.getDataByID();
    } else {
      this.noFinanceDetails = true;
    }
    // this.getfinancerList()
  }
  noFinanceDetails: any = false;
  dataLoader: any;
  sellingData: any;
  getDataByID() {
    this.share.showLoading('Getting Data...');
    let obj = this.share.getDataId(
      null,
      false,
      [],
      this.tractorDetails?.financeDetailedId,
    );
    this.api.postapi('getFinanceetailsByID', obj).subscribe(
      (res: any) => {
        this.financeData = res?.data;
        this.initiateSoldForm();
        this.getfinancerList();
        this.share.spinner.dismiss();
      
      },
      (error: any) => {
        this.share.spinner.dismiss();
      },
    );
  }
  financeData: any;
  initiateSoldForm() {
    let isPayoutReceived = false;
    if (this?.financeData?.isPayoutReceived == 1) {
      isPayoutReceived = true;
    }

    this.financeForm = this.formBuilder.group({
      payoutType: new FormControl(this?.financeData?.payoutType || null, [
        Validators.required,
      ]),
      payoutAmount: new FormControl(
        this?.financeData?.payoutAmount || null,
        [Validators.required],
      ),
      payoutDate: new FormControl(this?.financeData?.payoutDate || null, []),
      receivePayoutAmountType: new FormControl(this?.financeData?.receivePayoutAmountType || 'ONLINE'|| null, []),
      isPayoutReceived: new FormControl(isPayoutReceived, []),
      expectedDateOfPayout: new FormControl(
        this?.financeData?.expectedDateOfPayout || null,
        [],
      ),
      payout_remark: new FormControl(
        this?.financeData?.payout_remark || null,
        [],
      ),
      payout_percentage: new FormControl(
        this?.financeData?.payout_percentage || null,
        [],
      ),

      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
    });
  this.calculateAmount(false)
    // if (this.sellingData?.images?.length) {
    //   this.loadedImages = this.sellingData?.images||[];
    // }
  }
  calculateAmount(update:any=true){
    if(this.financeForm.controls['payoutType'].value=='PERCENT'){
  let val=this.financeForm.controls['payout_percentage'].value
    let financeAmount=Number(this.financeData?.financeAmount)||0
    let payoutAmount=(financeAmount*val)/100
  this.financeForm.controls['payoutAmount'].setValue(payoutAmount)
    }else{
      if(update){
  this.financeForm.controls['payoutAmount'].setValue(null)
      }

    }
  
  }
  financeForm: FormGroup;
  async openCrudManagement(type: any = 'BANK_DETAILS') {
    const modal = await this.modalControl.create({
      component: CrudPopupComponent,
      cssClass: 'light-modal',
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'BANK_DETAILS') {
      this.getfinancerList();
    }
    console.log('role', role);
  }
  financerList: any = [];
  selectedFinancer: any = null;
  getfinancerList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('bank', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.financerList = res?.data;
        this.selectedFinancer =
          this.financerList.find((f: any) => f.id == this.financeData.bankId) ||
          null;
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {},
    );
  }
  async updatePercent() {
    const modal = await this.modalControl.create({
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      component: UpdatePayoutPercentComponent,
      componentProps: {
        tractor: {
          id: this.selectedFinancer?.id,
          percent_0f_payout: this.selectedFinancer?.percent_0f_payout,
        },
        percent_0f_payout: this.selectedFinancer?.percent_0f_payout,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.selectedFinancer = data;
    }
  }
  checkStatus() {
    if (this.financeData?.payout_eligibility == 1) {
      this.updatePayoutStatusFalse();
    } else {
      this.updatePayoutStatusTrue();
    }
  }
  async updatePayoutStatusFalse() {
    const alert = await this.alertCtrl.create({
      header: 'Payout Not Eligible For This Deal',
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.changeToNoPayout(false);
    }
  }
  async updatePayoutStatusTrue() {
    const alert = await this.alertCtrl.create({
      header: 'Payout Eligible For This Deal',
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.changeToNoPayout(true);
    }
  }
  changeToNoPayout(status: any) {
    let objVal = {
      payout_eligibility: status,
    };
    let obj = {
      src: 'bankdetails',
      data: objVal,
      id: this.financeData?.id,
    };
    this.share.showLoading('Saving...');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.financeData = res?.rowData;
        this.share.spinner.dismiss();

        this.share.presentToast('Saved Succssfully...');
      
      },
      (error: any) => {},
    );
  }

  save() {
    if (this.financeForm.valid) {
      let objVal = this.getSensObj();
      let obj = {
        src: 'bankdetails',
        data: objVal,
        id: this.financeData?.id,
      };
      this.share.showLoading('Saving...');
      this.api.postapi('updateOpp', obj).subscribe(
        (res: any) => {
         // this.tractorDetails.financeDetailedId = res?.data;
          this.share.spinner.dismiss();

          this.share.presentToast('Saved Succssfully...');
          this.modalControl.dismiss(true);
        },
        (error: any) => {},
      );
    } else {
      this.financeForm.markAllAsTouched();
      this.share.presentToast('Please Fill Required Fields');
    }
  }

  getSensObj() {
    let obj: any = {};
    if (!this.financeData) {
      obj = this.financeForm.value;
    } else if (this.financeData) {
      obj = this.financeForm.value;
    }

    return obj;
  }
  updateSellingDetails() {
    if (this.financeForm.valid) {
      let obj = this.getSensObj();
      this.share.showLoading('Updating data...');
      this.api.postapi('updateFinanceDetails', obj).subscribe(
        (res: any) => {
          this.share.spinner.dismiss();
          this.share.presentToast('Updated Successfully...');
          this.modalControl.dismiss(true);
        },
        (error: any) => {
          this.share.spinner.dismiss();
          this.share.presentToast('Error...');
        },
      );
    } else {
      this.share.spinner.dismiss();
    }
  }
}
