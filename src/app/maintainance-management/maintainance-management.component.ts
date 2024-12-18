import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ModalController } from '@ionic/angular';
import { RepairTractorDashboardComponent } from './repair-tractor-dashboard/repair-tractor-dashboard.component';
@Component({
  selector: 'app-maintainance-management',
  templateUrl: './maintainance-management.component.html',
  styleUrls: ['./maintainance-management.component.scss'],
})
export class MaintainanceManagementComponent  implements OnInit {

  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController) { }
repairtractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.repairtractorList = [];
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
      isLive: false,
    };
    this.share.showLoading('Loading...');
    this.api.postapi('getTractorList', obj).subscribe(
      (res: any) => {
        this.repairtractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.repairtractorList = this.repairtractorList.filter(
          (f: any) => f?.tractor_status == 'AT_REPAIR_CENTER'
        );

        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
 async viewImage(tractor:any){
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
     
        tarctor_id: tractor.id,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
  async viewTractorDashboard(tractor:any){
    const modal = await this.modalCtrl.create({
      component: RepairTractorDashboardComponent,
      componentProps: {
     
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
  backupList:any=[]
}
