import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectRoleComponent } from './select-role/select-role.component';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {

  constructor(private share: ShareService, public alertCtrl: AlertController, private router: Router, private activated: ActivatedRoute,private modalCtrl:ModalController) {
    activated.url.subscribe((res) => {
      console.log("res", res);

    })
  }
  staffDetails: any
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);

    
  }
  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Logout?',
      subHeader: '',
      message: 'Are You Sure',
      buttons: ['Cancel', 'Yes']
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.share.clearSession()
      this.router.navigate(['/login'])
    }
    console.log(result);
  }
    async showRoleModel() {
      const modal = await this.modalCtrl.create({
        component: SelectRoleComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.4,
        cssClass: 'custom-modal',
        componentProps: {
       
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data && data?.isRoleChange) {
        console.log('data', data);
   
      }
     
    }

}
