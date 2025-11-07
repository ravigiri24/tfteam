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
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
@Component({
  selector: 'app-close-enquiry',
  templateUrl: './close-enquiry.component.html',
  styleUrls: ['./close-enquiry.component.scss'],
})
export class CloseEnquiryComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getModelList();
    this.initialize(this.enquiry);
  }
  staffDetails: any;
  initialize(data: any = null) {
    let store_id = 3;
    this.form = this.formBuilder.group({
      actionByid: new FormControl(this?.staffDetails?.id, [
        Validators.required,
      ]),
      close_date: new FormControl(data?.close_date, [Validators.required]),
      isOpen: new FormControl(false, [Validators.required]),
      isBooked: new FormControl(data?.isBooked || false, [Validators.required]),
      willBuyDate: new FormControl(data?.willBuyDate || false, []),
      bookedDate: new FormControl(data?.bookedDate || false, []),
      closing_remark: new FormControl(data?.closing_remark, [
        Validators.required,
      ]),
      bookedModel: new FormControl(data?.bookedModel, []),
    });
    // if (this.enquiry.isOpen == 1) {
    //   this.form.controls['isBooked'].setValue(true);
    // }
      if (this.enquiry.isBooked == 1) {
      this.form.controls['isBooked'].setValue(true);
    }
        if (this.enquiry.isBooked == 0) {
      this.form.controls['isBooked'].setValue(false);
    }

    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  modelName: any;
  enquiry: any;
  restart() {
    this.form.reset()

       let objVal = this.form.value;
    objVal.isOpen=true
    objVal.actionByid=this?.staffDetails?.id

    let obj = {
      src: 'customers_enquire',
      data: objVal,
      id: this.enquiry?.id,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.share.presentToast('Restart Successfully...');
      this.modalCtrl.dismiss(true);
    });
  }
  close() {
    if(this.form.valid){
    let objVal = this.form.value;
    let obj = {
      src: 'customers_enquire',
      data: objVal,
      id: this.enquiry?.id,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.share.presentToast('Closed Successfully...');
      this.modalCtrl.dismiss(true);
    });
  }else{
 this.share.presentToast('Please Fill All Details...');
  }
  }
  async selectItem() {
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: this.modelList,
        itemName: 'Model',
        table_name: 'Model',
        otherObjects: otherObjects,
        jsonKey: 'name',
        search: {
          name: null,
        },
      },
      cssClass: 'midium-model',
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.modelName = data?.name;
    this.form.controls['bookedModel'].setValue(data?.id);
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  modelList: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Loading...');
    this.api.postapi('getModelDataSanitized', obj).subscribe(
      (res: any) => {
        this.modelList = res.data;
        this.share?.spinner?.dismiss();
        if (
          this.enquiry.isOpen == 0 &&
          this.enquiry.bookedModel &&
          this.enquiry.isBooked
        ) {
          let findModel = this.modelList.find(
            (f: any) => f.id == this.enquiry.bookedModel
          );
          if (findModel) {
            this.modelName = findModel?.name;
          }
          this.form.controls['bookedModel'].setValue(true);
        }
      },
      (error: any) => {}
    );
  }
  toggleChanged(e: any) {
    console.log('e', e);
    if (e?.detail?.checked == true) {
    } else {
      this.modelName = null;
      this.form.controls['bookedModel'].setValue(null);
      this.form.controls['willBuyDate'].setValue(null);
      this.form.controls['bookedDate'].setValue(null);
    }
  }
}
