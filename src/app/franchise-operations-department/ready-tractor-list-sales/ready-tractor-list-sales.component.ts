import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { ViewTractorDetailsComponent } from 'src/app/shared-components/view-tractor-details/view-tractor-details.component';
import { Router } from '@angular/router';
// import { TractorDashboardComponent } from '../tractor-dashboard/tractor-dashboard.component';
import { TracotorListDisplayComponent } from '../tracotor-list-display/tracotor-list-display.component';
@Component({
  selector: 'app-ready-tractor-list-sales',
  templateUrl: './ready-tractor-list-sales.component.html',
  styleUrls: ['./ready-tractor-list-sales.component.scss'],
})
export class ReadyTractorListSalesComponent  implements OnInit {


  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
alltractorList:any=[]
tractorCounts:any
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];
 
    //this.getTractorList()
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
   
    };
  //  if(loader){
    this.share.showLoading('Loading...');
   // }
    this.api.postapi('getNewTractors', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  

        this.share?.spinner?.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
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
  backupList:any=[]
  tractorDashboard(tractor: any) {
    this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
  }
  backToList(){
    this.router.navigate(['/operational/all-tractor-management'])
  }
async openAllTractor() {
  const modal = await this.modalCtrl.create({
    component: TracotorListDisplayComponent,
    cssClass: 'custom-fullscreen-modal', // custom class to offset from right
  
    
  });
  return await modal.present();
}
}
