import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { ViewTractorDetailsComponent } from 'src/app/shared-components/view-tractor-details/view-tractor-details.component';
import { Router } from '@angular/router';
import { FranchiseTractorDashboardComponent } from '../franchise-tractor-dashboard/franchise-tractor-dashboard.component';
@Component({
  selector: 'app-store-tractor',
  templateUrl: './store-tractor.component.html',
  styleUrls: ['./store-tractor.component.scss'],
})
export class StoreTractorComponent  implements OnInit {


  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
alltractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];
 
    this.getTractorList()
  }
  refreshList(){
    this.getTractorList()
  }



  staffDetails:any

  getTractorList(loader:any=false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id:this.staffDetails?.storeId
   
    };
  //  if(loader){
    this.share.showLoading('Loading...');
   // }
    this.api.postapi('getTractorsStoresWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.alltractorList?.forEach((f:any)=>{
          if(f?.transactionDetails?.length>0){
          this.getTransaction(f?.transactionDetails||[],f)}
          else{
            f.remainigPayment=Number(f?.dealerPrice || 10);

          }
        })

        this.share?.spinner?.dismiss();
      
      },
      (error: any) => {}
    );
  }
    async viewTractorDashboard(tractor:any){
      const modal = await this.modalCtrl.create({
        component: ViewTractorDetailsComponent,
        componentProps: {
       
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
    //this.getTractorList()
    }
    async tractorDetailsEntry(tractor:any){
      const modal = await this.modalCtrl.create({
        component: FranchiseTractorDashboardComponent,
        componentProps: {
       
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
    //this.getTractorList()
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

}
