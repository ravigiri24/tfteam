import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from '../shared-components/tractor-dashboard/tractor-dashboard.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-all-tractor-list',
  templateUrl: './all-tractor-list.component.html',
  styleUrls: ['./all-tractor-list.component.scss'],
})
export class AllTractorListComponent  implements OnInit {

  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
alltractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];
    this.getTractorList();
  }
  refreshList(){
    this.getTractorList()
  }
  staffDetails:any

  getTractorList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
    };
    this.share.showLoading('Loading...');
    this.api.postapi('getTractorList', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  

        this.share.spinner.dismiss();
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
      component: TractorDashboardComponent,
      componentProps: {
     
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

  this.getTractorList()
  }
  backupList:any=[]
  tractorDashboard(tractor: any) {
    this.router.navigate(['/operational/view-dashboard', tractor?.id]);
  }

}
