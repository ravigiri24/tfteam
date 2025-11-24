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
  selector: 'app-view-appovals-list',
  templateUrl: './view-appovals-list.component.html',
  styleUrls: ['./view-appovals-list.component.scss'],
})
export class ViewAppovalsListComponent  implements OnInit {
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
selectedType:any='PENDING'
  ngOnInit() {}
  optionActionEventCall(){

  }
}
