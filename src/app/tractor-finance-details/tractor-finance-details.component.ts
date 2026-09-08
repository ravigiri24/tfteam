import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CrudPopupComponent } from '../shared-components/crud-popup/crud-popup.component';
import { UpdatePayoutPercentComponent } from '../finance-department/payout-details/update-payout-percent/update-payout-percent.component';
import { AddCashTractorComponent } from '../shared-components/add-cash-tractor/add-cash-tractor.component';
@Component({
  selector: 'app-tractor-finance-details',
  templateUrl: './tractor-finance-details.component.html',
  styleUrls: ['./tractor-finance-details.component.scss'],
})
export class TractorFinanceDetailsComponent implements OnInit {
  tractorDetails: any;
  @Input() listColorClass: any = 'fourthColor';
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private alertCtrl:AlertController
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
          this.getfinancerList();
      this.initiateSoldForm();
    }
    this.getCashList()

  }
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
        this.getfinancerList()
   
        this.share.spinner.dismiss();
      },
      (error: any) => {
        this.share.spinner.dismiss();
      },
    );
  }
  financeData: any;
  initiateSoldForm() {
    let is_viechle_registered =
      this?.financeData?.is_viechle_registered == 1 ? true : false;
          let isFinanceAmountReceived =
      this?.financeData?.isFinanceAmountReceived == 1 ? true : false;

    this.financeForm = this.formBuilder.group({
      tractorID: new FormControl(this?.tractorDetails?.id || null, [
        Validators.required,
      ]),
      bankId: new FormControl(this?.financeData?.bankId || null, [
        Validators.required,
      ]),
     finance_start_date: new FormControl(this?.financeData?.finance_start_date || null, [
        Validators.required,
      ]),
      isFIDone: new FormControl(this?.financeData?.isFIDone || null, []),
      isFinanceAmountReceived: new FormControl(isFinanceAmountReceived, []),
      receiveFinanceAmountType: new FormControl(this?.financeData?.receiveFinanceAmountType||'FINANCE', []),
      customer_type: new FormControl(
        this?.financeData?.customer_type || null,
        [],
      ),
      is_viechle_registered: new FormControl(is_viechle_registered, []),
      payout_eligibility: new FormControl(
        this?.financeData?.payout_eligibility || null,
        [],
      ),
       payout_percentage: new FormControl(
        this?.financeData?.payout_percentage || null,
        [],
      ),
      

      insurance_firm: new FormControl(
        this?.financeData?.insurance_firm || true,
        [],
      ),
      financeAmount: new FormControl(
        this?.financeData?.financeAmount || null,
        [],
      ),
      downPayment: new FormControl(this?.financeData?.downPayment || null, []),
      payoutAmount: new FormControl(this?.financeData?.payoutAmount || null, []),
      first_disbursal: new FormControl(
        this?.financeData?.first_disbursal || null,
        [],
      ),
      first_disbursal_date: new FormControl(
        this?.financeData?.first_disbursal_date || null,
        [],
      ),
      second_disbursal: new FormControl(
        this?.financeData?.second_disbursal || null,
        [],
      ),
      remark: new FormControl(this?.financeData?.remark || null, []),

      second_disbursal_date: new FormControl(
        this?.financeData?.second_disbursal_date || null,
      ),
      net_market: new FormControl(this?.financeData?.net_market || null),
      outstanding: new FormControl(this?.financeData?.outstanding || null),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
    });
    setTimeout(() => {
        let selectFinance = this.financerList.find(
      (f: any) => f.id == this?.financeData?.bankId,
    );

    if(selectFinance){
    this.selectFinance=selectFinance
    }
    }, 0);
  
    // if (this.sellingData?.images?.length) {
    //   this.loadedImages = this.sellingData?.images||[];
    // }
  }
  cashHistory: any[] = [];


  get totalCashReceived(): number {
    return this.cashHistory
      .filter((receipt: any) => Number(receipt?.isDeleted) !== 1)
      .reduce((total: number, receipt: any) => total + (Number(receipt?.cash_amount) || 0), 0);
  }
    async deleteTranction(tracsaction: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete This Transaction',
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
      this.removeJob(tracsaction);
    }
  }
  removeJob(tracsaction:any){
    let objData: any = {
      isDeleted:true,
      deletedDate:new Date(),
      deletedBy:this.staffDetails?.id
    };
    let obj = {
      src: 'cash_receving',
      data: objData,
      id: tracsaction?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Removed Successfully...');
      this.getCashList()
    //  this.dismiss();
    });
  }

    async updatePercent() {
      const modal = await this.modalControl.create({
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.4,
        cssClass: 'custom-modal',
        component: UpdatePayoutPercentComponent,
        componentProps: {
          tractor: {
            id: this.selectFinance?.id,
            percent_0f_payout: this.selectFinance?.percent_0f_payout,
          },
          percent_0f_payout: this.selectFinance?.percent_0f_payout,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
        this.selectFinance = data;
        let findIn=this.financerList.findIndex((f:any)=>f.id==this.selectFinance.id)
this.financerList[findIn]=   this.selectFinance
    //        this.financeForm.controls['payout_percentage'].setValue(
    //   this.selectFinance?.percent_0f_payout,
    // );
      }
    }
  selectFinance:any=null
  selectPayout() {
    let selectFinance = this.financerList.find(
      (f: any) => f.id == this.financeForm.controls['bankId'].value,
    );
    this.selectFinance=selectFinance
    this.financeForm.controls['payout_percentage'].setValue(
      selectFinance?.percent_0f_payout,
    );
    let payoutElligible = false;
    if (selectFinance?.payout_status == 'YES') {
      payoutElligible = true;
    }
    this.financeForm.controls['payout_eligibility'].setValue(payoutElligible);
    if(this.financeForm.controls['payoutType'].value == 'PERCENT'){
 this.financeForm.controls['payoutAmount'].setValue(null);
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
    async addCashHistory() {
    const modal = await this.modalControl.create({
      component: AddCashTractorComponent,
      cssClass: 'light-modal',
      componentProps: {
     tractor:this?.tractorDetails
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
if(data){
  this.cashHistory.unshift(data)
}
    console.log('role', role);
  }
  financerList: any = [];
  getfinancerList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('bank', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.financerList = res?.data;
             this.initiateSoldForm();
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {},
    );
  }
  
  getCashList() {

    let obj :any= this.share.getListObj('bank', false, [], true);
    obj.tractor_id=this.tractorDetails?.id
    this.api.postapi('getCashReceivingList', obj).subscribe(
      (res: any) => {
        this.cashHistory = res?.data || [];
         
   
      },
      (error: any) => {},
    );
  }
  save() {
    if (this.financeForm.valid) {
      let obj = this.getSensObj();

      this.share.showLoading('Saving...');
      this.api.postapi('addFinanceDetails', obj).subscribe(
        (res: any) => {
          this.tractorDetails.financeDetailedId = res?.data;
          this.share.spinner.dismiss();

          this.share.presentToast('Saved Succssfully...');
          this.modalControl.dismiss(true);
        },
        (error: any) => {},
      );
    } else {
      this.financeForm.markAllAsTouched();
      this.share.presentToast('Error...');
    }
  }

  getSensObj() {
    let obj: any = {};
    if (!this.financeData) {
      obj = this.financeForm.value;
    } else if (this.financeData) {
      obj = this.financeForm.value;
      obj.id = this.financeData?.id;
    }
  

    return obj;
  }
  updateSellingDetails() {
    this.financeForm.markAllAsTouched()
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
          this.share.presentToast('Please Enter Required Fields');
      this.share.spinner.dismiss();
    }
  }
}
