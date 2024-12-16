import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrls: ['./confirm-delivery.component.scss'],
})
export class ConfirmDeliveryComponent implements OnInit {
  tractor_id: any;
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getWareHouseLocationList();
    this.initialize();
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }

  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.fb.group({
      transportDestinationId: new FormControl(
        data?.transportDestinationId || null,
        [Validators.required]
      ),

      reachDate: new FormControl(data?.reachDate || null, [
        Validators.required,
      ]),
    });

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  loader: any;
  wareHouseLocationList: any = [];
  getWareHouseLocationList(loader: any = false) {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.wareHouseLocationList = res.data;
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
   async openCrudManagement(type: any) {
      const modal = await this.modalCtrl.create({
        component: CrudPopupComponent,
        componentProps: {
          type: type,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (type == 'WAREHOUSELOCATION') {
        this.getWareHouseLocationList()
      }
      console.log('role', role);
    }

  updateItem() {
    if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractor_id,
      };

      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Saved...');
      });
    } else {
      this.share.presentToast("Please fill all details")
      this.loader = false;
      this.form.markAllAsTouched();
    }
  }
}
