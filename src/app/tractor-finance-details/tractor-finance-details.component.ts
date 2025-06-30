import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { CrudPopupComponent } from '../shared-components/crud-popup/crud-popup.component';

@Component({
  selector: 'app-tractor-finance-details',
  templateUrl: './tractor-finance-details.component.html',
  styleUrls: ['./tractor-finance-details.component.scss'],
})
export class TractorFinanceDetailsComponent  implements OnInit {
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
    if(this.tractorDetails?.financeDetailedId){
      this.getDataByID()
  
      }else{
        this.initiateSoldForm();
      }
      this.getfinancerList()
  }
  dataLoader:any
  sellingData:any
  getDataByID(){
    this.share.showLoading("Getting Data...")
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.financeDetailedId);
    this.api.postapi('getFinanceetailsByID', obj).subscribe(
      (res:any) => {
        this.financeData = res?.data;
        this.initiateSoldForm();
        this.share.spinner.dismiss()
      },
      (error:any) => {
        this.share.spinner.dismiss()
      }
    );
  }
financeData:any
  initiateSoldForm() {
    this.financeForm = this.formBuilder.group({
      tractorID: new FormControl(this?.tractorDetails?.id || null, [Validators.required]),
      bankId: new FormControl(this?.financeData?.bankId || null, [Validators.required]),
      isFIDone: new FormControl(this?.financeData?.isFIDone || null, []),
      financeAmount: new FormControl(this?.financeData?.financeAmount || null, []),
      downPayment: new FormControl(this?.financeData?.downPayment  || null, []),
      first_disbursal: new FormControl(this?.financeData?.first_disbursal || null, []),
      first_disbursal_date: new FormControl(this?.financeData?.first_disbursal_date || null, []),
      second_disbursal: new FormControl(this?.financeData?.second_disbursal || null, []),
   

      second_disbursal_date: new FormControl(this?.financeData?.second_disbursal_date || null),
      net_market: new FormControl(this?.financeData?.net_market || null),
      outstanding: new FormControl(this?.financeData?.outstanding || null),
       actionByid: new FormControl(this.staffDetails?.id, [
        Validators.required,
      ]),
    
     
    });
   
    
    // if (this.sellingData?.images?.length) {
    //   this.loadedImages = this.sellingData?.images||[];
    // }
  }
  financeForm:FormGroup
  async openCrudManagement(type: any = 'BANK_DETAILS') {
    const modal = await this.modalControl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'BANK_DETAILS') {
      this.getfinancerList();
    }
    console.log('role', role);
  }
  financerList: any = [];
  getfinancerList(loader: any = false) {
    if(loader){
      this.share.showLoading("Refreshing Data...")
    }
    let obj = this.share.getListObj('bank', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.financerList = res?.data;
        if(loader){
          this.share.spinner.dismiss()
        }
      },
      (error:any) => {
       
      }
    );
  }
  save() {
    if (this.financeForm.valid) {
   
      let obj = this.getSensObj();
    
     this.share.showLoading("Saving...")
      this.api.postapi('addFinanceDetails', obj).subscribe(
        (res: any) => {
           this.share.spinner.dismiss()
           
          this.share.presentToast("Saved Succssfully...");
          this.modalControl.dismiss(true)
        },
        (error:any) => {
         
        }
      );
    } else {
      this.financeForm.markAllAsTouched();
      this.share.presentToast("Error...");
    }
  }

  getSensObj() {
    let obj:any={};
   if(!this.financeData){
         
    obj=this.financeForm.value


    }else if(this.financeData){
      obj=this.financeForm.value
      obj.id = this.financeData?.id;
  
    }
     
  return obj;
  }
  updateSellingDetails() {
    if (this.financeForm.valid) {
      let obj = this.getSensObj();
    this.share.showLoading("Updating data...")
    this.api.postapi('updateFinanceDetails', obj).subscribe(
      (res: any) => {

        this.share.spinner.dismiss()
        this.share.presentToast("Updated Successfully...")
        this.modalControl.dismiss(true)
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
