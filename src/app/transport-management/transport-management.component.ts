import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ConfirmDeliveryComponent } from './confirm-delivery/confirm-delivery.component';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import { AddTransportStatusComponent } from './add-transport-status/add-transport-status.component';
import { StartRepairDialogComponent } from './start-repair-dialog/start-repair-dialog.component';
import { StartTransportDialogComponent } from './start-transport-dialog/start-transport-dialog.component';
import { TransportOptionsComponent } from './transport-options/transport-options.component';
@Component({
  selector: 'app-transport-management',
  templateUrl: './transport-management.component.html',
  styleUrls: ['./transport-management.component.scss'],
})
export class TransportManagementComponent implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private share: ShareService,
    private api: ApiService,
    private route: Router,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}
  transportList: any = [];
  ionViewWillEnter() {
    this.transportList = [];
    this.getTractorList();
  }
  search={
    registractionNo:null
  }
      async viewImage(image:any){
        const modal = await this.modalCtrl.create({
          component: SingleImageShowComponent,
          componentProps: {
         
            image: image,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        if (role === 'confirm') {
       
        }
      }

  startRepairingApi(tractor: any) {
    let obj;

    obj = {
      data: { tractor_status: 'AT_REPAIR_CENTER' },
      src: 'tractor',
      id: tractor?.id,
    };

    this.share.showLoading('Updating...');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.getTractorList();
        this.share.spinner.dismiss();
        this.share.presentToast('Updated Successfully...');
      },
      (error: any) => {}
    );
  }
  // newArivalsList:any=[]
  backupList: any = [];
  userDetails: any;
  staffDetails: any;
  goToNewArival(data: any = null) {
    this.route.navigate(['/operational/add-new-arrivals']);
  }
  addCost(tractor: any) {
    this.route.navigate(['/transport-department/add-cost', tractor?.id]);
  }
    async startTranspotation(tractor: any) {
      const modal = await this.modalCtrl.create({
        component: StartTransportDialogComponent,
        componentProps: {
          tractorDetails: tractor,
      
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
        this.getTractorList('Refreshing Data...');
      }
    }
  getTractorList(loadingMsg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.share.showLoading(loadingMsg);
    this.api.postapi('getTractorList', obj).subscribe(
      (res: any) => {
        this.transportList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.transportList = this.transportList.filter(
          (f: any) => f?.tractor_status == 'AT_TRANSPORT'
        );

        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  tractor_id: any;
  addStatus(tractor: any) {
    this.showModal(tractor?.id);
  }
  async showDeliveryModal(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeliveryComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.getTractorList('Refreshing Data...');
    }
  }
    async startRepairing(tractor: any) {
      const modal = await this.modalCtrl.create({
        component: StartRepairDialogComponent,
        componentProps: {
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
        this.getTractorList('Refreshing Data...');
      }
    }

  async startReparinConfiemation(tractor: any) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: '',
      message: 'You want to Start the Repair!',
      buttons: ['Yes,Start!', 'Cancel'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.startRepairingApi(tractor);
    }
    console.log(result);
  }
  async showModal(tractor_id: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddTransportStatusComponent,
      componentProps: {
        tractor_id: tractor_id,
      },
    });
    await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);

    // if (role === 'confirm') {

    // }
  }
  refreshList() {
    this.getTractorList();
  }
  dataClear() {}
  tractorDashboard(tractor: any) {
    this.route.navigate(['/operational/view-dashboard', tractor?.id]);
  }
   async openOptions(tractor:any){
      const modal = await this.modalCtrl.create({
        component: TransportOptionsComponent,
        componentProps: {
       
          tractor: tractor,
     
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  if(data?.isDeleted || data?.isForworded || data?.isReached ){
    this.getTractorList('Refreshing Data...')
  }
      if (role === 'confirm') {
     
      }
    }
}
