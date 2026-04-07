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
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss'],
})
export class ActionPopupComponent  implements OnInit {
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
  tractor: any;
  tarctor_id: any;
  ngOnInit() {
    console.log('expenseTypeList', this.expenseTypeList);
    this.initialize(this.tractor);
  }

  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      approved_status: new FormControl(data?.approved_status, [
        Validators.required,
      ]),
      action_remark: new FormControl(data?.action_remark || null, [
        Validators.required,
      ]),
      action_date: new FormControl(data?.action_date || null),
      action_taken: new FormControl(true),
  
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
        src: 'transport_cost',
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

  async showModal(dataUpdate: any = null) { }
  saveExpense() {
    
    if (this.form.valid) {
      let obj = {
        src: 'new_findings',
        data: this.form.value,
        id: this.tractor?.id,
      };
      this.share.showLoading('Saving');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Action Saved');
        this.share.spinner.dismiss(true);
     
        return this.modalCtrl.dismiss(true, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
