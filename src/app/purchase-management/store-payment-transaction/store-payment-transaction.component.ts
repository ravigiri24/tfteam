import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';

import { Router } from '@angular/router';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { AddDealerPriceComponent } from '../add-dealer-price/add-dealer-price.component';
@Component({
  selector: 'app-store-payment-transaction',
  templateUrl: './store-payment-transaction.component.html',
  styleUrls: ['./store-payment-transaction.component.scss'],
})
export class StorePaymentTransactionComponent  implements OnInit {


  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
alltractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];
 
    this.getWareHouseList()
  }
  refreshList(){
    this.getTractorList()
  }

  selectedStore:any
  warehouseList:any=[]
  getWareHouseList(loader:any=false){
    let staffDetails: any = this.share.get_staff();
   
    this.staffDetails = JSON.parse(staffDetails);
        //if(loader){
        this.share.showLoading('Loading...');
       // }
        let obj: any = this.share.getListObj('warehouselocation', false, [], true);
        obj.storeId = this.staffDetails?.storeId;
 
        setTimeout(() => {
          this.api.postapi('getList', obj).subscribe(
            (res: any) => {
          this.warehouseList=res?.data
          this.warehouseList=this.warehouseList.reverse()
      
          console.log("this.warehouseList",  this.warehouseList);
          if(!loader){
            this.selectedStore=  this.warehouseList[0]?.id
             
          this.getTractorList();
           //   this.share.spinner?.dismiss();
          }
           
            },
            (error: any) => {}
          );
        }, 0);
  }
  getListByBrand(){
    console.log("getListByBrand",this.selectedStore);
    this.getTractorList(true)
  }
  staffDetails:any

  getTractorList(loader:any=false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      store_id: this.selectedStore,
    };
    if(loader){
    this.share.showLoading('Loading...');
    }
    this.api.postapi('getTractorsStoresWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  

        this.share?.spinner?.dismiss();
        this.backupList = res.data;
        this.alltractorList?.forEach((f:any)=>{
          if(f?.transactionDetails?.length>0){
          this.getTransaction(f?.transactionDetails||[],f)}
          else{
            f.remainigPayment=Number(f?.dealerPrice || 10);

          }
        })
     
      },
      (error: any) => {}
    );
  }
 async openTransaction(tractor: any = null){
  if(tractor?.dealerPrice==null || tractor?.dealerPrice==0){
    this.share.presentToast("Dealer Price Not Availaible,please Add")
    const modal = await this.modalCtrl.create({
      component: AddDealerPriceComponent,
      componentProps: {
  
        tractorDetails:tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
this.getTractorList(true)
    if (role === 'confirm') {

    }
  }else{
    this.showModal(tractor)
  }

  }
  getTransaction(transactionData:any,tractorDetails:any) {
    let listData:any=transactionData||[]

    let totalAmount=0
    totalAmount = 0;
    listData?.forEach((f: any) => {
      totalAmount =
        Number(totalAmount) + Number(f?.amount);
    });
    tractorDetails.listData=listData
    tractorDetails.totalAmount=totalAmount
  
    this.countPayment(tractorDetails)
  }
  countPayment(tractorDetails:any) {
   
    let dealearPrice = Number(tractorDetails?.dealerPrice || 0);
    let totalPaymentDone=0
    tractorDetails.listData?.forEach((f: any) => {
    totalPaymentDone =totalPaymentDone + Number(f?.amount);
    });
    tractorDetails.totalPaymentDone=totalPaymentDone
    tractorDetails.remainigPayment = dealearPrice - totalPaymentDone;
    console.log('tractorDetails',tractorDetails);
    
  }

    async showModal(tractor: any = null) {
      const modal = await this.modalCtrl.create({
        component: TransactionHistoryComponent,
        componentProps: {
    
          tractorDetails:tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
 
      }
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
  async viewTractorDashboard(tractor:any){
  //   const modal = await this.modalCtrl.create({
  //     component: TractorDashboardComponent,
  //     componentProps: {
     
  //       tractorDetails: tractor,
  //     },
  //   });
  //   await modal.present();
  //   const { data, role } = await modal.onWillDismiss();
  //   console.log('role', role);

  // this.getTractorList()
  }
  backupList:any=[]
  tractorDashboard(tractor: any) {
    this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
  }
  backToList(){
    this.router.navigate(['/operational/all-tractor-management'])
  }

}
