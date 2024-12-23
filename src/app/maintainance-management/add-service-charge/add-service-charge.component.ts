import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-service-charge',
  templateUrl: './add-service-charge.component.html',
  styleUrls: ['./add-service-charge.component.scss'],
})
export class AddServiceChargeComponent implements OnInit {
  tractorDetails: any;
  expense_head: any;
  editData: any = null;
  constructor(
    private modalControl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getExpense();
    this.getRepairingCenterList();
    this.initialize(this.editData)
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      expense_id: new FormControl(data?.expense_id || null, [
        Validators.required,
      ]),
      expense_amount: new FormControl(data?.expense_amount || null, []),

      expense_date: new FormControl(data?.expense_date || null, [
        Validators.required,
      ]),
      expense_type: new FormControl('REPAIR'),
      repairing_center: new FormControl(data?.repairing_center || null, [
        Validators.required,
      ]),
      tractor_id: new FormControl(this.tractorDetails?.id,),
    });
    if(this.expense_head=="PREDICTION"){
      this.form.controls['repairing_center']?.clearValidators()
      this.form.controls['expense_date']?.clearValidators()
      this.form.updateValueAndValidity()
      
    }
  }

  async openCrudManagement(type: any = 'MATERIAL_OF_REPAIRING') {
    const modal = await this.modalControl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'TYPE_OF_REPAIRING_EXPENSE') {
      this.getExpense();
    } else if (type == 'REPAIRINGCENTER') {
      this.getRepairingCenterList(true);
    }
    console.log('role', role);
  }
  expenseTypeList: any = [];
  getExpense(loader: any = false) {
    this.share.showLoading('Getting Data...');
    let obj: any = this.share.getListObj(
      'repairng_expense_type',
      false,
      [],
      true
    );
    obj.tractor_id = this.tractorDetails?.tractor_id;
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.expenseTypeList = res.data;
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  repairingCenterList: any = [];
  getRepairingCenterList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('rerepairingcenter', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.repairingCenterList = res?.data || [];
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  saveData() {
    if (this.form.valid) {
      let objData: any = this.form.value;
      let getSelected = this.expenseTypeList?.find(
        (f: any) => f.id == objData?.expense_id
      );

      objData.expense_amount = getSelected?.price;
      objData.expense_type = "REPAIR";
    
      objData.expense_head = this.expense_head;
      objData.expense_method = "SERVICE";
      objData.total_expense = getSelected?.price;
      objData.billNumber = "TF-"+Math.floor(100000 + Math.random() * 900000)
      objData.qty = 1;
      let obj = {
        src: 'reparing_cost',
        data: this.form.value,
      };
      console.log("saveData",obj);
      
      this.share.showLoading("Saving Data...")
      this.api.postapi('addOpp', obj).subscribe((res:any) => {
        this.share.spinner.dismiss()
        this.form.reset();
        this.share.presentToast("Saved Successfully...")
        this.dismiss()
      
      });
    }else{
this.share.presentToast("Please Fill Required Fields")
    }
  }
  updateData() {
    if (this.form.valid) {
      let objData: any = this.form.value;
      let getSelected = this.expenseTypeList?.find(
        (f: any) => f.id == objData?.expense_id
      );

      objData.expense_amount = getSelected?.price;
       objData.total_expense = getSelected?.price;
    
      objData.qty = 1;
   
      let obj = {
        src: 'reparing_cost',
        data: this.form.value,
        id:this.editData?.id
      };
   
      this.share.showLoading("Updating Data...")
      this.api.postapi('updateOpp', obj).subscribe((res:any) => {
        this.share.spinner.dismiss()
        this.form.reset();
        this.share.presentToast("Updated Successfully...")
        this.dismiss()



      
      });
    }else{
this.share.presentToast("Please Fill Required Fields")
    }
  }
}
