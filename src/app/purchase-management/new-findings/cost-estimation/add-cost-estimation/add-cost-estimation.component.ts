import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-add-cost-estimation',
  templateUrl: './add-cost-estimation.component.html',
  styleUrls: ['./add-cost-estimation.component.scss'],
})
export class AddCostEstimationComponent  implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) { }
  expenseTypeList: any;
  @Input() listColorClass: any = "sixColor";
  form: FormGroup;
  data: any;
  tarctor_id: any;
  ngOnInit() {
    console.log('expenseTypeList', this.expenseTypeList);
    this.initialize(this.data);
  }

  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      cost_estimation_id: new FormControl(data?.cost_estimation_id || null, [
        Validators.required,
      ]),
      cost_value: new FormControl(data?.cost_value || null, [
        Validators.required,
      ]),
    
      tractor_id: new FormControl(this.tarctor_id || null, [
        Validators.required,
      ]),
    });
    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  updateItem() {
    this.form.controls['tractor_id'].setValue(this.tarctor_id);
    if (this.form.valid) {
      let obj = {
        src: 'tractor_cost_estimation',
        data: this.form.value,
        id: this.data?.id,
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.form.reset();
        return this.modalCtrl.dismiss(null, 'confirm');
        // this.getList()
      });
    } else {
      this.form.markAllAsTouched();
    }
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
    if (type == 'NEW_FINDING_COST_ESTIMATION_HEADING') {
      this.getExpense()
    }
    console.log('role', role);
  }
  getExpense() {
    this.share.showLoading("Refreshing Data...")
    let obj: any = this.share.getListObj('cost_estimation_heading', false, [], true);
    obj.tractor_id = this.tarctor_id;
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.expenseTypeList = res.data;
        this.share.spinner.dismiss()
      },
      (error: any) => { }
    );
  }
  async showModal(dataUpdate: any = null) { }
  saveExpense() {
    this.form.controls['tractor_id'].setValue(this.tarctor_id);
    if (this.form.valid) {
      let obj = {
        src: 'tractor_cost_estimation',
        data: this.form.value,
      };
      this.share.showLoading('Saving');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Expense Added Successfully');
        this.share.spinner.dismiss();
        this.form.reset();
        return this.modalCtrl.dismiss(null, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
