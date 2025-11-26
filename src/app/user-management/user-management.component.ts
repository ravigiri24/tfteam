import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectRoleComponent } from './select-role/select-role.component';
import { ApiService } from '../api.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { SelectStoreComponent } from './select-store/select-store.component';
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
  selected_store: any;
  checkAuthenticationAndRoleList() {
    let obj = {
      staff_id: this.staffDetails?.id,
    };
    this.share.showLoading('Getting Data');
    this.api.postapi('checkAuthenticationAndRoleList', obj).subscribe(
      (res: any) => {
        this.share.spinner.dismiss('active_three');

        if (res?.data?.status == false) {
          this.share.clearSession();
          this.share.presentToast('Invalid Access');
          this.router.navigate(['/login']);
        } else if (res?.data?.status == true) {
          if (res?.data?.data?.allotedStore?.length) {
            let selectedStore = this.share.get_sales_officer_store();
            if (selectedStore != null) {
              this.selected_store = JSON.parse(selectedStore);
            } else {
              this.share.set_sales_officer_store(
                JSON.stringify(res?.data?.data?.allotedStore[0])
              );
              this.selected_store = res?.data?.data?.allotedStore[0];
            }

            this.share.set_sales_officer_storeList(
              JSON.stringify(res?.data?.data?.allotedStore)
            );
            this.share.setStoreSalesOfficer();
          }
          if (res?.data?.data?.staff_role == 'SALES_OFFICER') {
            this.share.setRolesForSalesOfficer();
          }
        }
      },
      (error: any) => {}
    );
  }


  setStoreSalesOfficer() {
    let user: any = this.share.get_staff();
    let userde = JSON.parse(user);
    userde.storeId = this.selected_store?.store_id;
    this.share.set_staff_detail_session(userde);
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
  async showStoreList() {
    const modal = await this.modalCtrl.create({
      component: SelectStoreComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {},
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data && data?.isStoreChange) {
      this.selected_store = data?.selectedStore;
      this.share.set_sales_officer_store(JSON.stringify(data?.selectedStore));
      this.setStoreSalesOfficer();
    }
  }
  async updatePassword() {
    const modal = await this.modalCtrl.create({
      component: UpdatePasswordComponent,

      cssClass: 'custom-modal',
      componentProps: {
        staffDetails: this.staffDetails,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data) {
      this.share.clearSession();
      this.share.presentToast('Updated Successfully,Please Re Login');
      this.router.navigate(['/login']);
    }
  }
}
