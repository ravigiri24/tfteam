import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from 'src/app/share.service';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-view-transaction-details',
  templateUrl: './view-transaction-details.component.html',
  styleUrls: ['./view-transaction-details.component.scss'],
})
export class ViewTransactionDetailsComponent  implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController
  ) {}
  totalPaymentDone=0
  remainigPayment=0
  dealearPrice=0
  tractorDetails:any
  transaction:any


  ngOnInit() {
    
    
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
