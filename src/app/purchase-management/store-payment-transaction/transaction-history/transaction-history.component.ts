import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from 'src/app/share.service';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular'
import { AddTransactionComponent } from '../../add-transaction/add-transaction.component';
import { ViewTransactionDetailsComponent } from '../../view-transaction-details/view-transaction-details.component';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent  implements OnInit {

 constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController
  ) {}
tractorDetails:any
showAddButton:any=true
  ngOnInit() {


  }
  form: FormGroup;
  data: any;
  tractor_id: any;
  ionViewWillLeave() {
  
  }

  async showModal(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddTransactionComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        transactionData:this.listData,
        data: dataUpdate,
    
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

 
    this.getList()

  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  totalPaymentDone=0
  remainigPayment=0
  dealearPrice=0
  countPayment() {
    this.totalPaymentDone=0
    this.dealearPrice = Number(this?.tractorDetails?.dealerPrice || 0);
    this.listData?.forEach((f: any) => {
      this.totalPaymentDone = this.totalPaymentDone + Number(f?.amount);
    });
    this.remainigPayment = this.dealearPrice - this.totalPaymentDone;
  }
  async transactionDetails(transaction:any){
    const modal = await this.modalCtrl.create({
      component: ViewTransactionDetailsComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        transaction:transaction,
        totalPaymentDone:this.totalPaymentDone,
        remainigPayment:this.remainigPayment,
        dealearPrice:this.dealearPrice

  
    
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
  showAdd = true;
  ionViewWillEnter() {

  

    this.listData = [];

  

    this.getList();
 
  }
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  dataClear() {
    this.editData = null;
    this.form.reset();
  }
  backToTansport() {
    this.router.navigate(['operational/transport-management']);
  }
  openEdit(row: any, ind: any) {
    let name = 'open-modal-cost' + this.tractor_id;
    document.getElementById('open-modal-cost')?.click();
    this.editData = row;
   
  }
  editData: any;


  message: any;
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  listData: any;
  totalAmount = 0;
  getList() {
    let obj: any = this.share.getListObj('tractor_transaction', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.share.showLoading('Loading...');
    this.api.postapi('getDealerTransaction', obj).subscribe(
      (res: any) => {
        this.listData = res.data;
     
     
        //this.listData.reverse();
        this.totalAmount = 0;
        this.listData?.forEach((f: any) => {
          this.totalAmount =
            Number(this.totalAmount) + Number(f?.amount);
        });
        this.share.spinner.dismiss();
        this.countPayment()
      },
      (error: any) => {}
    );
  }
  expenseTypeList: any = [];
  getExpense() {
    let obj: any = this.share.getListObj('expensetype', false, [], true);
    obj.tractor_id = this.tractor_id;
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.expenseTypeList = res.data;
      },
      (error: any) => {}
    );
  }

}
