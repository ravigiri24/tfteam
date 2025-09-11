import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-close-hot-deal',
  templateUrl: './close-hot-deal.component.html',
  styleUrls: ['./close-hot-deal.component.scss'],
})
export class CloseHotDealComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}
  close_remark: any;
  staffDetails: any;
  closeHotDealDate: any = new Date();
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
  }
  hotDeal: any;
  saveForm() {
    let objVal = {
      close_remark: this.close_remark,
      closeHotDealDate: this.closeHotDealDate,
      isDealOpen:false,
      actionByid: this.staffDetails?.id,
    };
    let obj = {
      src: 'hotcustomer',
      data: objVal,
      id: this.hotDeal?.id,
    };
this.share.showLoading("Closing...")
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Closed Successfully...');
      this.modalCtrl.dismiss(true);

      //  this.dismiss();
    });
  }
}
