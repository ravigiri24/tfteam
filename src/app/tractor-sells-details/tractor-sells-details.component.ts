import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { CrudPopupComponent } from '../shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-tractor-sells-details',
  templateUrl: './tractor-sells-details.component.html',
  styleUrls: ['./tractor-sells-details.component.scss'],
})
export class TractorSellsDetailsComponent  implements OnInit {
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
    this.getCompanyRepresentativeList()
    this.getWareHouseLocationList()
    if(this.tractorDetails?.isSold && this.tractorDetails?.sellingDetailedId){
    this.getDataByID()

    }else{
      this.initiateSoldForm();
    }
  }
  dataLoader:any
  sellingData:any
  getDataByID(){
    this.share.showLoading("Getting Data...")
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.sellingDetailedId);
    this.api.postapi('getSellingDetailsByID', obj).subscribe(
      (res:any) => {
        this.sellingData = res?.data;
        this.initiateSoldForm();
        this.share.spinner.dismiss()
      },
      (error:any) => {
        this.share.spinner.dismiss()
      }
    );
  }
  soldStatusForm:FormGroup
  initiateSoldForm() {
    this.soldStatusForm = this.formBuilder.group({
      tractorID: new FormControl(this?.tractorDetails?.id || null, [Validators.required]),
      nameOfCustomer: new FormControl(this?.sellingData?.nameOfCustomer || null, [Validators.required]),
      mobileNo: new FormControl(this?.sellingData?.mobileNo || null, [Validators.required]),
      address: new FormControl(this?.sellingData?.address  || null, [Validators.required]),
      sellingPrice: new FormControl(this?.sellingData?.sellingPrice || null, [Validators.required]),
      companyRepresentative: new FormControl(this?.sellingData?.companyRepresentative || null, [Validators.required]),
      wareHouseLocation: new FormControl(this?.sellingData?.wareHouseLocation || null, [Validators.required]),
   
       remark: new FormControl(this?.sellingData?.remark || null),
       sellingDate: new FormControl(this?.sellingData?.sellingDate || null),
       brokerId: new FormControl(this?.sellingData?.brokerId || null),
       actionByid: new FormControl(this.staffDetails?.staffCode, [
        Validators.required,
      ]),
    
     
    });
    console.log("soldStatusForm",this.soldStatusForm);
    
    // if (this.sellingData?.images?.length) {
    //   this.loadedImages = this.sellingData?.images||[];
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
      } else if (type == 'COMPANYREPRESENTATIVE') {
        this.getCompanyRepresentativeList(true);
      }
      else if(type =='WAREHOUSELOCATION'){
        this.getWareHouseLocationList(true);
      }
      console.log('role', role);
    }
  companyRepresentativeList: any = [];
  getCompanyRepresentativeList(loader: any = false) {
    if(loader){
      this.share.showLoading("Refreshing Data...")
    }
    let obj = this.share.getListObj('companyrepresentative', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
     
        this.companyRepresentativeList = res?.data;
        if(loader){
          this.share.spinner.dismiss()
        }
      },
      (error:any) => {
 
      }
    );
  }
  wareHouseLocationList: any = [];
  getWareHouseLocationList(loader: any = false) {
    if(loader){
      this.share.showLoading("Refreshing Data...")
    }
    let obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.wareHouseLocationList = res?.data;
        if(loader){
          this.share.spinner.dismiss()
        }
      },
      (error:any) => {
       
      }
    );
  }
  loader = false;
  save() {
    if (this.soldStatusForm.valid) {
   
      let obj = this.getSensObj();
    
     this.share.showLoading("Saving...")
      this.api.postapi('addSellingDetails', obj).subscribe(
        (res: any) => {
           this.share.spinner.dismiss()
           
          this.share.presentToast("Saved Succssfully...");
          this.dismiss()
        },
        (error:any) => {
         
        }
      );
    } else {
      this.soldStatusForm.markAllAsTouched();
      this.share.presentToast("Error...");
    }
  }
  updateData(){}
  getSensObj() {
    let obj:any={};
   if(!this.sellingData){
         
    obj=this.soldStatusForm.value
    obj.documets = [];

    }else if(this.sellingData){
      obj=this.soldStatusForm.value
      obj.id = this.sellingData?.id;
  
      obj.documets = [];
      obj.loadedImages = [];
    }
     
  return obj;
  }
  updateSellingDetails() {
    if (this.soldStatusForm.valid) {
      let obj = this.getSensObj();
    this.share.showLoading("Refreshing Data...")
    this.api.postapi('updateSellingDetails', obj).subscribe(
      (res: any) => {

        this.share.spinner.dismiss()
        this.share.presentToast("Updating Data...")
        this.dismiss()
     
      },
      (error:any) => {
        this.share.spinner.dismiss()
        this.share.presentToast("Error...")
      }
    );
    }
    else {
      this.share.spinner.dismiss()
    }
  }

}
