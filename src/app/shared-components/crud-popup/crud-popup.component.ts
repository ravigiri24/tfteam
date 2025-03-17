import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';

import crud from 'src/app/crud.json';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-crud-popup',
  templateUrl: './crud-popup.component.html',
  styleUrls: ['./crud-popup.component.scss'],
})
export class CrudPopupComponent  implements OnInit {
type:any
  constructor(private share:ShareService,private api:ApiService,private formBuilder:FormBuilder,public modalCtrl:ModalController) { }
  crudDetail:any
  ngOnInit() {
    this.crudDetail = crud.crud.find((f:any) => f.key == this.type);
    this.getList()
  }
  view:any='LIST'
  formAction:any
  viewAction(view:any) {
    this.view = view;
    if (view == 'FORM') {
      this.formAction = 'ADD';
      if(this.crudDetail?.isDynamicList){
        this.getDynamicList()
      }
      this.initialize();
    } else if (view == 'LIST') {
      this.getList();
    }
  }
  dynamicListData:any=[]
  getDynamicList() {
   
    let obj = this.share.getListObj(
      this.crudDetail?.srcDynamicValue,
      false,
      [],
      true
    );
    this.share.showLoading("Fetching Data...")
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
      
        this.dynamicListData = res.data ||[];
        this.share.spinner.dismiss()
      },
      (error:any) => {
 
      }
    );
  }
  dismiss() {  
    return this.modalCtrl.dismiss(null,'Cancel'); 
  } 
  addItem() {
    if (this.form.valid) {
      let obj = {
        src: this.crudDetail.src,
        data: this.form.value,
      };
      this.share.showLoading('Saving Data..')
      this.api.postapi('addOpp', obj).subscribe((res:any) => {
        this.share.spinner.dismiss()
     this.share.presentToast("Saved SuccessFully...")
        this.form.reset();
      
      });
    } else {
      this.form.markAllAsTouched();
 
    }
  }

  editRow:any={}
  editData(data:any) {
    this.initialize(data);
    this.editRow=data
    this.formAction = 'UPDATE';
    this.view = 'FORM';
    if(this.crudDetail?.isDynamicList){
      this.getDynamicList()
    }
  }
  updateItem(){
    if (this.form.valid) {
      let obj = {
        src: this.crudDetail.src,
        data: this.form.value,
        id:this.editRow?.id
      };
      this.share.showLoading('Saving Data..')
      this.api.postapi('updateOpp', obj).subscribe((res:any) => {
        this.share.spinner.dismiss()
        this.share.presentToast("Updated SuccessFully...");
        this.form.reset();

      this.viewAction('LIST')
      });
    } else {
      this.form.markAllAsTouched();

    }
  }
  openEdit(data:any){

  }

  form:FormGroup
  initialize(data:any=null) {
    this.form = this.formBuilder.group({});
    this.crudDetail.data?.forEach((element:any) => {
      this.form.addControl(
        element?.key,
        new FormControl(data?.[element?.key] || null, [Validators.required])
      );
    });
    
    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
    console.log('this.form', this.form);
  }
  listData: any = [];
  getList() {
   
    let obj = this.share.getListObj(
      this.crudDetail.src,
      false,
      [],
      true
    );
    this.share.showLoading("Fetching Data...")
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
      
        this.listData = res.data;
        this.share.spinner.dismiss()
      },
      (error:any) => {
 
      }
    );
  }
}
