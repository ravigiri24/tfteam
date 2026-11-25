import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrls: ['./confirm-delivery.component.scss'],
})
export class ConfirmDeliveryComponent implements OnInit {
  tractorDetails: any;
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private commonMethodSerive:CommonMethodService
  ) { }
  @Input() listColorClass: any = "sixColor";
  ngOnInit() {
    this.getWareHouseLocationList();
    this.initialize(this.tractorDetails);
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  updateTranctorStatus: any = true
  form: FormGroup;
  initialize(data: any = null) {
    if (this.updateTranctorStatus) {
      this.form = this.fb.group({
        transportDestinationId: new FormControl(
          data?.transportDestinationId || null,
          [Validators.required]
        ),

        reachDate: new FormControl(data?.reachDate || null, [
          Validators.required,
        ]),
        tractor_status: new FormControl(null),

        isLive: new FormControl(true, [
          Validators.required,
        ]),
        isDraft: new FormControl(true, [
          Validators.required,
        ]),
      });
    } else {
      this.form = this.fb.group({
        transportDestinationId: new FormControl(
          data?.transportDestinationId || null,
          [Validators.required]
        ),

        reachDate: new FormControl(data?.reachDate || null, [
          Validators.required,
        ]),

      });
    }
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
      (error: any) => { }
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
        id: this.tractorDetails?.id,
      };
      this.share.showLoading("Updating Details...")
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss()
        this.share.presentToast('Details Saved...');
        this.updateWarehouseAllotement()
     


      });
    } else {
      this.share.presentToast("Please fill all details")
      this.loader = false;
      this.form.markAllAsTouched();
    }
  }
   updateWarehouseAllotement() {
    if (this.form.valid) {
      let dataWarehouse: any = {
        wareHouseLocation: this.form.value.transportDestinationId,
        assign_date: this.form.value.reachDate,
      };
      let obj = {
        src: 'tractordetailadmin',
        data: dataWarehouse,
        id: this.tractorDetails?.tractordetailadmin?.id,
      };
  this.share.showLoading("Applying Store")
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {

     this.saveAllotmentData()
     this.commonMethodSerive.reloadMethod=true
         this.modalCtrl.dismiss({ isReached: true })
        this.share.presentToast('Store Alloted Successfully');
    
      });
    } else {
      this.share.presentToast('Please fill all details');

   
    }
  }
   saveAllotmentData() {
    if (this.form.valid) {
      let dataWarehouse: any = {
        store_id:this.form.value.transportDestinationId,
        tractor_id: this.tractorDetails?.id,
        assign_date: this.form.value.reachDate,
      };
      let obj = {
        src: 'tractor_assiging_history',
        data: dataWarehouse,
      
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {

   
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
