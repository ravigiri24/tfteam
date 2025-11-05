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
  selector: 'app-add-enqiury',
  templateUrl: './add-enqiury.component.html',
  styleUrls: ['./add-enqiury.component.scss'],
})
export class AddEnqiuryComponent  implements OnInit {
 enquiry: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
this.getStateList()
this.getModelList()
    this.initialize(this.enquiry);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
 
  formWarehouse: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      customerName: new FormControl(data?.customerName,   [Validators.required]),
      mobileNo: new FormControl(data?.mobileNo,   [Validators.required]),
      remark: new FormControl(data?.remark,   []),
      modal_ids: new FormControl(data?.remark, [Validators.required]),
      storeId: new FormControl(data?.storeId, [Validators.required]),
      actionByid: new FormControl(data?.storeId, [Validators.required]),
      state_id: new FormControl(data?.state_id, [Validators.required]),
      city_id: new FormControl(data?.city_id, [Validators.required]),
      village: new FormControl(data?.village, [Validators.required]),
      strength: new FormControl(data?.strength, [Validators.required]),
      inStoke: new FormControl(data?.inStoke, [Validators.required]),

    });

    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  stateList: any = [];
  stateName:any
  cityName:any
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        if(this.enquiry?.state_id){

      let find= this.stateList.find((d:any)=>d.id==this.form.controls['state_id'].value)  
      if(find){
        this.stateName = find?.name;
      } 
        }
        this.getCityList();
      },
      (error: any) => {}
    );
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
      },
      (error: any) => {}
    );
  }
  cityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        let find= this.cityList.find((d:any)=>d.id==this.form.controls['city_id'].value)  
        if(find){
          this.cityName = find?.name;
        } 
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (
      itemName == 'City' &&
      this.form.controls['state_id'].value 
    ) {
      if(this.cityListFilter?.length){
        return true;
      }else{
        this.getCityListFilter()
   
        return true;
      }
   
    } else {
      return false;
    }
  }
  cityListFilter: any = [];
  getCityListFilter() {
    let getStateId = this.form?.controls['state_id']?.value;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
   async selectItem(list: any, itemName: any, table_name: any) {
     let openStatus = this.checkOpenCon(itemName);
     if(openStatus){
 
    
     let otherObjects: any;
     if (itemName == 'City') {
       list=this.cityListFilter
       otherObjects = {
         state_id: this.form.controls['state_id'].value,
       };
     }
 
     const modal = await this.modalCtrl.create({
       component: SelectWithSearchComponent,
       componentProps: {
         list: list,
         itemName: itemName,
         table_name: table_name,
         otherObjects: otherObjects,
         jsonKey:'name',
         search:  {
           name: null,
         }
       },
          cssClass: 'midium-model',
     });
     await modal.present();
 
     const { data, role } = await modal.onWillDismiss();
     if (itemName == 'State') {
       if (data) {
         this.form.controls['state_id'].setValue(data?.id);
         this.form.controls['city_id'].setValue(null);
         this.cityName = null;
         this.stateName = data?.name;
         this.getCityListFilter();
       }
     } else if (itemName == 'City') {
       this.cityName = data?.name;
       this.form.controls['city_id'].setValue(data?.id);
     }
     console.log('role', role, data);
 
     if (role === 'confirm') {
     }
   }else{
     this.share.presentToast("Please Select State First")
   }
   }
}
