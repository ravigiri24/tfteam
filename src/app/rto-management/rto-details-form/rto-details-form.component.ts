import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
@Component({
  selector: 'app-rto-details-form',
  templateUrl: './rto-details-form.component.html',
  styleUrls: ['./rto-details-form.component.scss'],
})
export class RtoDetailsFormComponent  implements OnInit {
   tractorDetails:any
  constructor(private modalControl:ModalController,private share:ShareService,private api:ApiService,private formBuilder:FormBuilder) { }

  dismiss() {
    this.modalControl.dismiss();
  }
  staffDetails:any
  ngOnInit() {

  
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getBrokerList()
   
    if(this.tractorDetails?.rtoDetailsId){
    this.getDataByID()

    }else{
   
      this.initiateRToForm();
    }
  }
    async selectItem(list: any, itemName: any, table_name: any) {
      let openStatus = this.checkOpenCon(itemName);
      if(openStatus){
  
     
      let otherObjects: any;
      if (itemName == 'City') {
        list=this.cityListFilter
        otherObjects = {
          state_id: this.soldStatusForm.controls['state_id'].value,
        };
      }
  
      const modal = await this.modalControl.create({
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
      });
      await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
      if (itemName == 'State') {
        if (data) {
          this.soldStatusForm.controls['state_id'].setValue(data?.id);
          this.soldStatusForm.controls['city_id'].setValue(null);
          this.cityName = null;
          this.stateName = data?.name;
          this.getCityListFilter();
        }
      } else if (itemName == 'City') {
        this.cityName = data?.name;
        this.soldStatusForm.controls['city_id'].setValue(data?.id);
      }
      console.log('role', role, data);
  
      if (role === 'confirm') {
      }
    }else{
      this.share.presentToast("Please Select State First")
    }
    }
      stateList: any = [];
  getStateList() {
   // this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        if(this.rtoData?.state_id){

      let find= this.stateList.find((d:any)=>d.id==this.soldStatusForm.controls['state_id'].value)  
      if(find){
        this.stateName = find?.name;
      } 
        }
        this.getCityList();
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
        let find= this.cityList.find((d:any)=>d.id==this.soldStatusForm.controls['city_id'].value)  
        if(find){
          this.cityName = find?.name;
        } 
      //  this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
      stateName: any;
  cityName: any;
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (
      itemName == 'City' &&
      this.soldStatusForm.controls['state_id'].value 
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
    let getStateId = this.soldStatusForm?.controls['state_id']?.value;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
  dataLoader:any
  rtoData:any
  getDataByID(){
    this.share.showLoading("Getting Data...")
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.rtoDetailsId);
    this.api.postapi('getRTODetailsByID', obj).subscribe(
      (res:any) => {
        this.rtoData = res?.data;
          this.share.spinner.dismiss()
        this.initiateRToForm();
    
      
      },
      (error:any) => {
        this.share.spinner.dismiss()
      }
    );
  }
  soldStatusForm:FormGroup
  initiateRToForm() {
   
    this.soldStatusForm = this.formBuilder.group({
      tractorID: new FormControl(this?.tractorDetails?.id || null, [Validators.required]),
      brokerId: new FormControl(this?.rtoData?.brokerId || null, []),
      rto_cost: new FormControl(this?.rtoData?.rto_cost || null, [Validators.required]),
      insurance_cost: new FormControl(this?.rtoData?.insurance_cost  || null, [Validators.required]),
      date_of_transfer: new FormControl(this?.rtoData?.date_of_transfer || null, []),
       remark: new FormControl(this?.rtoData?.remark || null),
       actionByid: new FormControl(this.staffDetails?.id, [
        Validators.required,
      ]),
    
     
    });
    console.log("soldStatusForm",this.soldStatusForm);
    
    // if (this.rtoData?.images?.length) {
    //   this.loadedImages = this.rtoData?.images||[];
    // }
  }

  loadedImages:any=[]
  upload:any=[]

 
  brokerList: any = [];
  getBrokerList(loader: any = false) {
if(loader){
  this.share.showLoading("Refreshing Data...")
}
    let obj = this.share.getListObj('broker', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
     
        this.brokerList = res?.data;
        if(loader){
          this.share.spinner.dismiss()
        }
      },
      (error:any) => {
    
      }
    );
  }
   async openCrudManagement(type: any = 'BROKER') {
      const modal = await this.modalControl.create({
        component: CrudPopupComponent,
        componentProps: {
          type: type,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (type == 'BROKER') {
        this.getBrokerList();
      } 
    
      console.log('role', role);
    }



  loader = false;
  save() {
    if (this.soldStatusForm.valid) {
   
      let obj = this.getSensObj();
    
     this.share.showLoading("Saving...")
      this.api.postapi('addRtoDetails', obj).subscribe(
        (res: any) => {
           this.share.spinner.dismiss()
           
          this.share.presentToast("Saved Succssfully...");
          this.modalControl.dismiss(true)
        },
        (error:any) => {
         
        }
      );
    } else {
      this.soldStatusForm.markAllAsTouched();
      this.share.presentToast("Please fill required fields");
    }
  }
  updateData(){}
  getSensObj() {
    let obj:any={};
   if(!this.rtoData){
         
    obj=this.soldStatusForm.value
   

    }else if(this.rtoData){
      obj=this.soldStatusForm.value
      obj.id = this.rtoData?.id;
  
    }
     
  return obj;
  }
  updateRtoDetails() {
    if (this.soldStatusForm.valid) {
      let obj = this.getSensObj();
    this.share.showLoading("Updating Data...")
    this.api.postapi('updateRtoDetails', obj).subscribe(
      (res: any) => {

        this.share.spinner.dismiss()
        this.share.presentToast("Updated Successfully...")
        this.modalControl.dismiss(true)
     
      },
      (error:any) => {
        this.share.spinner.dismiss()
        this.share.presentToast("Please fill required fields");
      }
    );
    }
    else {
          this.soldStatusForm.markAllAsTouched();
            this.share.presentToast("Please fill required fields");
      this.share.spinner.dismiss()
    }
  }
  

}
