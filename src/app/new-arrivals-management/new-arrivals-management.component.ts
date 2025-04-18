import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { StartTransportDialogComponent } from '../transport-management/start-transport-dialog/start-transport-dialog.component';
@Component({
  selector: 'app-new-arrivals-management',
  templateUrl: './new-arrivals-management.component.html',
  styleUrls: ['./new-arrivals-management.component.scss'],
})
export class NewArrivalsManagementComponent implements OnInit {
  constructor(
  private modalCtrl: ModalController,
  private alertCtrl: AlertController,
  private share: ShareService,
  private api: ApiService,
  private route: Router
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.newArivalsList = [];
    this.getTractorList();
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
  async showAlert(tractor: any, i: any) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: '',
      message: 'You want to Start the trasportation!',
      buttons: ['Yes,Transport It!', 'Cancel'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.startTransport(tractor);
    }
    console.log(result);
  }
  startTransport(tractor: any) {
    let obj;

    obj = {
      data: { tractor_status: 'AT_TRANSPORT' },
      src: 'tractor',
      id: tractor?.id,
    };

    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.getTractorList();
      },
      (error: any) => {}
    );
  }
  newArivalsList: any = [];
  backupList: any = [];
  userDetails: any;
  staffDetails: any;
  goToNewArival(data: any = null) {
    this.route.navigate(['/operational/add-new-arrivals']);
  }
  openEdit(tractor: any, i: any) {
    this.route.navigate(['/operational/edit-newarrivals', tractor?.rowCode]);
  }

  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorList', obj).subscribe(
      (res: any) => {
        this.newArivalsList = res.data;
        this.newArivalsList = this.newArivalsList.filter(
          (f: any) => f?.tractor_status == 'NEW_ARRIVAL'
        );

        this.share?.spinner?.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  search={
    registractionNo:null
  }
  refreshList() {
    this.getTractorList();
  }
  dataClear() {}
}
