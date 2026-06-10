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
    this.getModelList()
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


  async showModal(dataUpdate: any = null) { }
  saveExpense() {
    if(this.form.controls['approved_status'].value=='REJECTED'){
    if (this.form.valid) {
  this.updateDataOnly()
    } else {
         this.share.presentToast('Please Fill Required Fields');
      this.form.markAllAsTouched();
    }
  }else if(this.form.valid){
    if(this.tractor.action_taken==0){
  this.onSaveTractor() 
    }
   else if(this.tractor.action_taken==1 && this.tractor?.approved_status=='REJECTED' ){
  this.onSaveTractor() 
    }
  else{
    this.updateDataOnly()
  }

  }else{
        this.form.markAllAsTouched();
            this.share.presentToast('Please Fill Required Fields');
  }
  }
  updateDataOnly(){
      let obj = {
        src: 'new_findings',
        data: this.form.value,
        id: this.tractor?.id,
      };
      this.share.showLoading('Saving');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Action Saved');
        this.share.spinner.dismiss(true);
     
         this.modalCtrl.dismiss(true, 'confirm');

        //this.view='LIST'
      });
  }
      modelList: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading("Loading")
    this.api.postapi('getModelDataSanitized', obj).subscribe(
      (res: any) => {
        this.modelList = res.data;
        let modelSelected=this.modelList.find((f:any)=>f.id==this.tractor?.model_id)
        if(modelSelected){
          this.setModelDetailEvent(modelSelected)
        }
 this.share.spinner.dismiss()
      },
      (error: any) => { }
    );
  }

   setModelDetailEvent(modelSelected: any) {
    this.modelForm = this.share.initialize(null, this.modelForm);
    setTimeout(() => {
   
      
      this.share.setModelDetail(modelSelected, this.modelForm);

      this.modelForm?.controls['hours'].setValue(this.tractor?.hours);
      this.modelForm?.controls['yearOfManufactoring'].setValue(
 this.tractor?.yearOfManufactoring
      );

  let grp= this.modelForm.controls['purchasedetail'] as FormGroup   
   grp?.controls['chasisNumber'].setValue(this.tractor?.chassisNumber)
   grp?.controls['registrationNumber'].setValue(this.tractor?.registractionNo)
   grp?.controls['engineNumber'].setValue(this.tractor?.engineNo)
   grp?.controls['dealer_id'].setValue(this.tractor?.dealerId)
   grp?.controls['purchasePrice'].setValue(this.tractor?.finalPrice)
      grp?.updateValueAndValidity();
      this.modelForm.updateValueAndValidity();
     console.log('this.newTractorForm', this.modelForm.value);

    }, 0);

  
   
  }
    modelForm:FormGroup
  
  loadedImages:any=[]
  upload:any=[]
    getSensObj(isDraft: any = true) {
    let obj;
    obj = this.modelForm.value;
    let getLeftImage = this.modelForm.controls['leftImage'] as FormGroup;
    let getRightImage = this.modelForm.controls['rightImage'] as FormGroup;
    let getFrontImage = this.modelForm.controls['frontImage'] as FormGroup;
    let getBackImage = this.modelForm.controls['backImage'] as FormGroup;
    let getDisplayImage = this.modelForm.controls['displayImage'] as FormGroup;


      obj.leftImage = getLeftImage.controls['file'].value;
      obj.rightImage = getRightImage.controls['file'].value;
      obj.frontImage = getFrontImage.controls['file'].value;
      obj.backImage = getBackImage.controls['file'].value;
      obj.displayImage = getDisplayImage.controls['file'].value;
      obj.tractorImages = this.upload;
      obj.isDraft = isDraft;
    

    return obj;
  }
    newTractorDetails: any;
  onSaveTractor() {
    if (this.checkValidation()) {
      let obj = this.getSensObj();
      console.log('onSave', obj);

     
        // console.log('modelForm', this.modelForm.value, 'obj', obj);
        this.share.showLoading('Saving...');
        this.api.postapi('addTractor', obj).subscribe(
          (res: any) => {
            // this.loader = false;
    
         
            this.newTractorDetails = res?.data;
            //this.share.presentToast("Saved Successfully...")
            //  this.share.openSnackbarAddSuccess();
                this.updateTractorData(this.newTractorDetails)
          },
      
          (error: any) => {
            //  this.loader = false;
          }
        );
      
    } else {
      //this.share.openSnackbarValidationError();
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  updateTractorData(newTractor:any){
      let objVal={
      isFromNewFindings:true,
      newFindingId:this.tractor?.id,
    }
      let obj = {
        src: 'tractor',
        data: objVal,
        id: newTractor?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
  

     this.updateNewFindings(newTractor)
      });
  }
  updateNewFindings(newTractor:any){
   
        let objVal:any=this.form.value
    
       objVal.approved_tractor_id=newTractor?.id
      let obj = {
        src: 'new_findings',
        data: objVal,
        id: this.tractor?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
             this.share.presentToast('Action Submitted,Tractor Added in New Arrivals');
           this.share.spinner.dismiss();
   
         this.modalCtrl.dismiss(true, 'confirm');
      });
  }
  checkValidation() {
    let status = false;
this.modelForm.updateValueAndValidity()
      if (this.modelForm.valid) {
        status = true;
      } else {
        status = false;
      }
    

    return status;
  }
}
