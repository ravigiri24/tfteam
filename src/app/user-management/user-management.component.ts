import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectRoleComponent } from './select-role/select-role.component';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  constructor(
    private api: ApiService,
    private share: ShareService,
    public alertCtrl: AlertController,
    private router: Router,
    private activated: ActivatedRoute,
    private modalCtrl: ModalController
  ) {
    activated.url.subscribe((res) => {
      console.log('res', res);
    });
  }
  staffDetails: any;
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
  }
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    this.checkAuthenticationAndRoleList();
    // this.getTractorList();
  }
  checkAuthenticationAndRoleList() {
    let obj = {
      staff_id: this.staffDetails?.id,
    };
this.share.showLoading("Getting Data")
    this.api.postapi('checkAuthenticationAndRoleList', obj).subscribe(
      (res: any) => {
        this.share.spinner.dismiss('active_three')
        if (res?.data?.status == false) {
          this.share.clearSession();
          this.share.presentToast('Invalid Access');
          this.router.navigate(['/login']);
        } else if (res?.data?.status == true) {
       
        }
      },
      (error: any) => {}
    );
  }
  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Logout?',
      subHeader: '',
      message: 'Are You Sure',
      buttons: ['Cancel', 'Yes'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.share.clearSession();
      this.router.navigate(['/login']);
    }
    console.log(result);
  }
  async showRoleModel() {
    const modal = await this.modalCtrl.create({
      component: SelectRoleComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {},
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data && data?.isRoleChange) {
      console.log('data', data);
      let user: any = this.share.get_staff();
      let userde = JSON.parse(user);
      userde.currentRole = data?.selectedRole;
      this.share.set_staff_detail_session(userde);
      this.share.checkLogin();
    }
  }
}
