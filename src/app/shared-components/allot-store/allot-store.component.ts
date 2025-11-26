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
  selector: 'app-allot-store',
  templateUrl: './allot-store.component.html',
  styleUrls: ['./allot-store.component.scss'],
})
export class AllotStoreComponent  implements OnInit {

  tractorDetails: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getWareHouseLocationList();
    this.initialize(this.tractorDetails);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
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
  formWarehouse: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
  

      wareHouseLocation: new FormControl(
        this.tractorDetails?.tractordetailadmin?.wareHouseLocation || null,
        [Validators.required]
      ),
    });

    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }


  updateWarehouseAllotement() {
    if (this.form.valid) {
      let dataWarehouse: any = {
        wareHouseLocation: this.form.value.wareHouseLocation,
      };
      let obj = {
        src: 'tractordetailadmin',
        data: dataWarehouse,
        id: this.tractorDetails?.tractordetailadmin?.id,
      };

      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.tractorDetails.dealerPrice = this.form.value.dealerPrice;
   
        this.share.spinner.dismiss();
        this.share.presentToast('Store Alloted Successfulyy');
        this.modalCtrl.dismiss(
          { dataEnterd: true, dealerPrice: this.form.value.dealerPrice,wareHouseLocation: this.form.value.wareHouseLocation },
          'confirm'
        );
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
