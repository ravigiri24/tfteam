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
  selector: 'app-add-rto-insurance-cost',
  templateUrl: './add-rto-insurance-cost.component.html',
  styleUrls: ['./add-rto-insurance-cost.component.scss'],
})
export class AddRtoInsuranceCostComponent implements OnInit {
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
      insurance_cost: new FormControl(data?.insurance_cost, [
        Validators.required,
      ]),

      rto_cost: new FormControl(data?.rto_cost || null, [Validators.required]),
    });

    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }

  savePrice() {
    if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractorDetails?.id,
      };
      this.share.showLoading('Updating Details...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Details Saved...');
        this.modalCtrl.dismiss({ dataEnterd: true }, 'confirm');
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
