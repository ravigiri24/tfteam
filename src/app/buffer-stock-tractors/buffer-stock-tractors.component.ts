import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { ImageViewerComponent } from '../maintainance-management/image-viewer/image-viewer.component';
import { ModalController } from '@ionic/angular';
import { ImageDashboardComponent } from '../maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from '../maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { Router } from '@angular/router';
import { SyncTractorWithMaintaninanceComponent } from '../shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
@Component({
  selector: 'app-buffer-stock-tractors',
  templateUrl: './buffer-stock-tractors.component.html',
  styleUrls: ['./buffer-stock-tractors.component.scss'],
})
export class BufferStockTractorsComponent  implements OnInit {


  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
buffertractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.buffertractorList = [];
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
    this.api.postapi('getBufferTractorList', obj).subscribe(
      (res: any) => {
        this.buffertractorList = res.data;
      

        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
 async viewImage(tractor:any){
    const modal = await this.modalCtrl.create({
      component: ImageDashboardComponent,
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

    this.getTractorList()
  }
  backupList:any=[]
  tractorDashboard(tractor: any) {
    this.router.navigate(['/operational/view-dashboard', tractor?.id]);
  }
async  syncManitainance(tractor:any){
  
        const modal = await this.modalCtrl.create({
          component: SyncTractorWithMaintaninanceComponent,
          componentProps: {
            tractor: tractor,
          },
        });
        await modal.present();
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

}
