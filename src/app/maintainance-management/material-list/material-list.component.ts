import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss'],
})
export class MaterialListComponent implements OnInit {
  tractorDetails: any;
  expense_head: any;
  editData: any = null;
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}
  selectedArray: any = [];
  ngOnInit() {
    this.getList();
    this.getRepairingCenterList();
    this.initialize(this.editData);
  }
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      expense_date: new FormControl(data?.expense_date || null, [
        Validators.required,
      ]),
      expense_type: new FormControl('REPAIR'),
      repairing_center: new FormControl(data?.repairing_center || null, [
        Validators.required,
      ]),
      tractor_id: new FormControl(this.tractorDetails?.id || null),
    });
  }

  dismiss() {
    this.modalControl.dismiss();
  }
  deletedData: any = [];
  newDataEdited:any=[]
  checkedAction(e: any, material: any) {
    console.log('checkedAction', event);
    material.checked = e?.detail?.checked;
    if (!material?.checked) {
      material.qty = 1;
      if (this.editData) {
        if (material?.recordId) {
     
          this.deletedData.push({ deletedId: material?.recordId });
         delete material.recordId
        }
      }
    } else if (material?.checked) {
     
    }
  }
  async addMaterial() {
    const modal = await this.modalControl.create({
      component: AddMaterialComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  search: any;
  async openCrudManagement(type: any = 'MATERIAL_OF_REPAIRING') {
    const modal = await this.modalControl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'MATERIAL_OF_REPAIRING') {
      this.getList();
    } else if (type == 'REPAIRINGCENTER') {
      this.getRepairingCenterList(true);
    }
    console.log('role', role);
  }
  updateData() {
    let checkedList = this.materialList.filter((f: any) => f.checked == true);
    if (checkedList?.length && this.form.valid) {
      let forUpdate=checkedList?.filter((f:any)=>f.recordId!=null)
      this.share.showLoading('Updating data...');
      let obj: any = this.share.getListObj('reparing_cost', false, [], true);
      obj.forUpdate = forUpdate || [];
      obj.forDelete = this.deletedData ||[];
      obj.newEntries = checkedList?.filter((f:any)=>f.recordId==null || f.recordId==undefined) || [];
      obj.expense_date = this.form.controls['expense_date'].value;
      obj.expense_type = this.form.controls['expense_type'].value;
      obj.repairing_center = this.form.controls['repairing_center'].value;
      obj.tractor_id = this.form.controls['tractor_id'].value;
      obj.billNumber=this.editData?.billNumber
      console.log('obj', obj);
      
      this.api.postapi('updatematerial', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Saved...');
        this.dismiss();
      });
    } else {
      this.share.presentToast('Please fill required fields');
    
    }
  }
  materialList: any = [];
  saveData() {
    let checkedList = this.materialList.filter((f: any) => f.checked == true);
    if (checkedList?.length && this.form.valid) {
      this.share.showLoading('Saving data...');
      let obj: any = this.share.getListObj('reparing_cost', false, [], true);
      obj.checkedList = checkedList;
      obj.expense_date = this.form.controls['expense_date'].value;
      obj.expense_type = this.form.controls['expense_type'].value;
      obj.repairing_center = this.form.controls['repairing_center'].value;
      obj.tractor_id = this.form.controls['tractor_id'].value;
      console.log('obj', obj);

      this.api.postapi('addmaterial', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Saved...');
        this.dismiss();
      });
    } else {
      this.share.presentToast('Please fill required fields');
    }
  }
  getList() {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('repairmateriallist', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.materialList = res.data;
        this.materialList?.forEach((element: any) => {
          element.checked = false;
          element.expense_head = this.expense_head;
          element.qty = 1;
          element.total_expense = element.qty * element.price;
        });
        if (this.editData) {
          this.setEditedData();
        }
        // this.materialList?.forEach((element:any) => {
        //  this.materialList.push(element)
        // });
        // this.materialList?.forEach((element:any) => {
        //   this.materialList.push(element)
        //  });
        //  this.materialList?.forEach((element:any) => {
        //   this.materialList.push(element)
        //  });
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  setEditedData() {
    this.editData?.checkedList?.forEach((element: any) => {
      let getVal = this.materialList.find(
        (f: any) => f.id == element?.expense_id
      );
      let getValIndex = this.materialList.findIndex(
        (f: any) => f.id == element?.expense_id
      );
      this.materialList.splice(getValIndex, 1);

      if (getVal) {
        (getVal.checked = true), (getVal.qty = element?.qty);

        getVal.total_expens = element?.total_expens;
        getVal.recordId = element?.id;
      }
      this.materialList.unshift(getVal);
    });
  }
  saveExpense() {}

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
  qtyUp(mat: any) {
    if (mat?.checked) {
      mat.qty++;
      this.calCulateToTalExpense(mat);
    }
  }
  qtyDown(mat: any) {
    if (mat?.checked) {
      if (mat.qty > 1) {
        mat.qty--;
        this.calCulateToTalExpense(mat);
      }
    }
  }
  calCulateToTalExpense(mat: any) {
    mat.total_expense = Number(mat.qty) * Number(mat?.price);
  }
}
