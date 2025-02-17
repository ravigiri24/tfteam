import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { ViewTransactionDetailsComponent } from 'src/app/purchase-management/view-transaction-details/view-transaction-details.component';
@Component({
  selector: 'app-store-tansaction',
  templateUrl: './store-tansaction.component.html',
  styleUrls: ['./store-tansaction.component.scss'],
})
export class StoreTansactionComponent  implements OnInit {

 constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController) { }
transactionList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.transactionList = [];
 
    this.getTransactionList()
  }
  refreshList(){
    this.getTransactionList()
  }


  staffDetails:any

  getTransactionList(loader:any=false) {
    
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id:this.staffDetails?.storeId
   
    };
    obj
  //  if(loader){
    this.share.showLoading('Loading...');
   // }
    this.api.postapi('getTransactionStoresWise', obj).subscribe(
      (res: any) => {
        this.transactionList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  
console.log(" this.transactionList", this.transactionList);

        this.share?.spinner?.dismiss();
     
      },
      (error: any) => {}
    );
  }
    async transactionDetails(transaction:any){
      let tractorDetails=transaction?.tractorDetails
    let  totalPaymentDone
    let remainigPayment
    let dealearPrice
      const modal = await this.modalCtrl.create({
        component: ViewTransactionDetailsComponent,
        componentProps: {
          tractorDetails: tractorDetails,
          transaction:transaction,
          totalPaymentDone:totalPaymentDone,
          remainigPayment:remainigPayment,
          dealearPrice:dealearPrice,
          showExtraDetails:false
   },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
    }
 async viewImage(tractor:any){
    // const modal = await this.modalCtrl.create({
    //   component: ImageViewerComponent,
    //   componentProps: {
     
    //     tarctor_id: tractor.id,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);

    // if (role === 'confirm') {
   
    // }
  }

}
