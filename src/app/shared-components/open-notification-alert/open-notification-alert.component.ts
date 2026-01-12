import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { NotificationPopUpComponent } from '../notification-pop-up/notification-pop-up.component';
@Component({
  selector: 'app-open-notification-alert',
  templateUrl: './open-notification-alert.component.html',
  styleUrls: ['./open-notification-alert.component.scss'],
})
export class OpenNotificationAlertComponent  implements OnInit {
count:any
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  listColorClass: any = 'firstColor';
  dismiss() {
    this.modalCtrl.dismiss();
  }
staffDetails:any
  ngOnInit() {
      let staffDetails: any = this.share.get_staff();
       this.staffDetails = JSON.parse(staffDetails);
  }
  
     async viewNotification() {
         this.modalCtrl.dismiss()
      const modal = await this.modalCtrl.create({
        component: NotificationPopUpComponent,
  
        componentProps: {
  
        },
           cssClass: 'midium-model',
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
    
      if (role === 'confirm') {
      }
    
    }
  
  markAsRead(){
       let obj: any = this.share.getStaffObj();
   obj.staff_id=this.staffDetails?.id
   this.share.showLoading("Mark As Read")
       this.api.postapi('readNotification', obj).subscribe(
      (res: any) => {
       this.share.spinner.dismiss()
       this.modalCtrl.dismiss()
      },
      (error: any) => {}
    );
  }
}
