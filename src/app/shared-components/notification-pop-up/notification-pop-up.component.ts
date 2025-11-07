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
@Component({
  selector: 'app-notification-pop-up',
  templateUrl: './notification-pop-up.component.html',
  styleUrls: ['./notification-pop-up.component.scss'],
})
export class NotificationPopUpComponent  implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {}

}
