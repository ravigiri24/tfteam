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
  selector: 'app-add-material-expense',
  templateUrl: './add-material-expense.component.html',
  styleUrls: ['./add-material-expense.component.scss'],
})
export class AddMaterialExpenseComponent  implements OnInit {

  tractorDetails: any;
  expense_head: any;
  editData: any = null;
  constructor(
    private modalControl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  staffDetails: any;
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getList();
    this.getSpareCategory();
    // this.getRepairingCenterList();
    this.initialize(this.editData);
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      expense_id: new FormControl(data?.expense_id || null, []),
      action_id: new FormControl(this.staffDetails?.id || null, [
        Validators.required,
      ]),
      
      expense_amount: new FormControl(data?.expense_amount || null, []),
      qty: new FormControl(data?.qty || 1, [Validators.required]),

      expense_date: new FormControl(data?.expense_date || null, []),
      expense_type: new FormControl('REPAIR'),
      repairing_center: new FormControl(
        this.staffDetails?.repair_center || null,
        [Validators.required]
      ),
      tractor_id: new FormControl(this.tractorDetails?.id),
    });
    if (this.expense_head == 'PREDICTION') {
      this.form.controls['repairing_center']?.clearValidators();
      this.form.controls['expense_date']?.clearValidators();
      this.form.updateValueAndValidity();
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
    if (type == 'MATERIAL_OF_REPAIRING') {
      this.getList();
    }
    else if(type == 'CATEGOEY_OF_MATERIAL'){
      this.getSpareCategory(true)
    }
    console.log('role', role);
  }

  materialList:any=[]
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
          let getSelectedExpense = this.materialList.find(
            (ex: any) => ex.id == this.editData?.expense_id
          );
          if (getSelectedExpense) {
            this.selectedItem = getSelectedExpense;
          }
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
  spareList:any=[]
  getSpareCategory(loader:any=false) {
    if(loader){
    this.share.showLoading('Loading...');
    }
    let obj = this.share.getListObj('spare_category', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.spareList = res.data;
    
        // this.materialList?.forEach((element:any) => {
        //  this.materialList.push(element)
        // });
        // this.materialList?.forEach((element:any) => {
        //   this.materialList.push(element)
        //  });
        //  this.materialList?.forEach((element:any) => {
        //   this.materialList.push(element)
        //  });
        if(loader){
        this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  repairingCenterList: any = [];
  repairingCenterListBackup: any = [];
  getRepairingCenterList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('rerepairingcenter', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.repairingCenterList = res?.data || [];
        this.repairingCenterListBackup = res?.data || [];
        if (loader) {
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {}
    );
  }
  addNewServiceCrud(serviceObj: any,save:any=true) {
    let obj = {
      src: 'repairmateriallist',
      data: { name: this.selectedItem?.name,category:this.category },
    };
    this.api.postapi('addOpp', obj).subscribe((res: any) => {
      // this.share.spinner.dismiss()
      // this.form.reset();
      console.log('res', res);
      serviceObj.expense_id = res?.data;
if(save==true){

  this.saveExepense(serviceObj);
}else{
  this.updateCall(serviceObj)
}
    });
  }
  saveExepense(objServie: any) {
    let obj = {
      src: 'repair_expense_costing',
      data: objServie,
    };
    console.log('saveData', obj);

    this.share.showLoading('Saving Data...');
    this.api.postapi('addOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.form.reset();
      this.share.presentToast('Saved Successfully...');
      this.dismiss();
    });
  }
  saveData() {
    if (this.form.valid && this.selectedItem?.name && this.tractorDetails?.id) {
      let objData: any = this.form.value;

      objData.expense_type = 'REPAIR';

      objData.expense_head = this.expense_head;
      objData.tractor_id = this.tractorDetails?.id;
      objData.expense_method = 'MATERIAL';
      objData.total_expense = Number(objData.expense_amount)*Number(objData?.qty);
      objData.billNumber = 'TF-' + Math.floor(100000 + Math.random() * 900000);
    //  objData.qty = 1;
      if (this.selectedItem?.id == null) {
        this.addNewServiceCrud(objData);
      } else {
        objData.expense_id = this.selectedItem?.id;
        this.saveExepense(objData);
      }
    } else {
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  updateData() {
    if (this.form.valid && this.selectedItem?.name && this.tractorDetails?.id) {
      let objData: any = this.form.value;

      objData.expense_type = 'REPAIR';

      objData.expense_head = this.expense_head;
      objData.tractor_id = this.tractorDetails?.id;
      objData.expense_method = 'MATERIAL';
      objData.total_expense = Number(objData.expense_amount)*Number(objData?.qty);
      //objData.billNumber = 'TF-' + Math.floor(100000 + Math.random() * 900000);
    //  objData.qty = 1;
      if (this.selectedItem?.id == null) {
        this.addNewServiceCrud(objData,false);
      } else {
        objData.expense_id = this.selectedItem?.id;
        this.updateCall(objData);
      }
    } else {
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  updateCall(objData: any) {
    let obj = {
      src: 'repair_expense_costing',
      data: objData,
      id: this.editData?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.form.reset();
      this.share.presentToast('Updated Successfully...');
      this.dismiss();
    });
  }
  showSearchList = false;
  onInputFocus() {
  
    //  this.expenseTypeList=this.expenseTypeListBackup

    this.showSearchList = true;
  }
  focusOut() {
    console.log('focusOut');
    // this.search.name=null
    // this.search.id=null
    setTimeout(() => {
     // if(!this.spareListOpen){
        this.showSearchList = false;
     // }
     
    }, 100);
  }
  search: any = {
    name: null,
    id: null,
  };
  selectedItem: any = {
    name: null,
    id: null,
    category:null
  };
  setValue(val: any) {
    console.log('setValue');

    this.selectedItem.name = val?.name;
    this.selectedItem.id = val?.id;
    this.search.name = null;
  }
  test(e: any) {
    console.log('test', this.search.name);
  }
  addNewService() {

    this.selectedItem.name = this.search.name;
    this.selectedItem.id = null;
    this.showSearchList = false;
    this.search.name = null;
  }
  spareListOpen=false
  onInputSpare(){
this.spareListOpen=true
  }
  focusOutSpare(){
    this.spareListOpen=false
  }
  category:any=1

  setSpareCategory(){
    this.selectedItem.category=false
  }
}
