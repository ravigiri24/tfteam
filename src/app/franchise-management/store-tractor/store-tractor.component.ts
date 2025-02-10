import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { ViewTractorDetailsComponent } from 'src/app/shared-components/view-tractor-details/view-tractor-details.component';
import { Router } from '@angular/router';
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

}
