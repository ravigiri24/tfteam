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
export class ActionPopupComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
  ) {}
  expenseTypeList: any;
  @Input() listColorClass: any = 'sixColor';
  form: FormGroup;
  data: any;
  tractor: any;
  tarctor_id: any;
  staffDetails: any;
  ngOnInit() {
      let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    console.log('expenseTypeList', this.expenseTypeList);
    this.getModelList();
    this.initialize(this.tractor);
    this.getPurchaseList();
    this.getCompanyRepresentativeList();
  
  }
  costEstimation: any = [];
  getList() {
    let obj: any = this.share.getListObj(
      'tractor_cost_estimation',
      false,
      [],
      true,
    );
    obj.tractor_id = this.tractor?.id;
    this.share.showLoading('Loading...');
    this.api.postapi('tractor_cost_estimation_byId', obj).subscribe(
      (res: any) => {
        this.costEstimation = res.data;
      this.setEstimationValue()
        this.costEstimation.reverse();
        this.getFindingDetailsInNewArrivals()
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  setEstimationValue(){
     let rto = this.costEstimation?.filter((f: any) => f.costType == 'RTO');
        let rtoTotal = 0;
        rto?.forEach((rtoS: any) => {
          rtoTotal = rtoTotal + Number(rtoS?.cost_value);
        });
        this.form.controls['rto_cost'].setValue(rtoTotal);
        let insurance = this.costEstimation?.filter(
          (f: any) => f.costType == 'INSURANCE',
        );
        let insuranceTotal = 0;
        insurance?.forEach((isu: any) => {
          insuranceTotal = insuranceTotal + Number(isu?.cost_value);
        });
        this.form.controls['insurance_cost'].setValue(insuranceTotal);

        let refurbish = this.costEstimation?.filter(
          (f: any) => f.costType == 'REFURBISH',
        );
        let refurbishTotal = 0;
        refurbish?.forEach((isu: any) => {
          refurbishTotal = refurbishTotal + Number(isu?.cost_value);
        });
        this.form.controls['maintainanceEstimationCost'].setValue(
          refurbishTotal,
        );
        let logistic = this.costEstimation?.filter(
          (f: any) => f.costType == 'LOGISTIC',
        );
        let logisticTotal = 0;
        logistic?.forEach((isu: any) => {
          logisticTotal = logisticTotal + Number(isu?.cost_value);
        });
        this.form.controls['inwardEstimationCost'].setValue(logisticTotal);
        this.form.controls['parkLocation'].setValue(
          this.tractor?.delearDetails?.location,
        );

        this.form.updateValueAndValidity();
  }
  async openCrudManagement(type: any) {
    const modal = await this.modalCtrl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'COMPANYREPRESENTATIVE') {
      this.getCompanyRepresentativeList();
    }
    if (type == 'TYPE_OF_PURCHASE') {
      this.getPurchaseList();
    }

    console.log('role', role);
  }
  getActionValueObj() {
    this.form.updateValueAndValidity();
    let formV = this.form.value;
    return {
      approved_status: formV?.approved_status,
      action_remark: formV?.action_remark,
      action_date: formV?.action_date,
      action_taken: formV?.action_taken,
      takingActionId:formV?.takingActionId
    };
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
      takingActionId : new FormControl(this.staffDetails?.id || null),
      action_taken: new FormControl(true),
      purchanseDate: new FormControl(data?.purchanseDate, []),
      expectedDateOfArrival: new FormControl(data?.purchanseDate, []),
      typeOfPurchase: new FormControl(data?.typeOfPurchase, []),
      purchasePrice: new FormControl(this.tractor?.finalPrice, []),
      amountTransferDate: new FormControl(data?.amountTransferDate, []),
      parkLocation: new FormControl(data?.parkLocation, []),
      companyRepresentative: new FormControl(data?.parkLocation, []),
      rto_cost: new FormControl(data?.rto_cost, []),
      insurance_cost: new FormControl(data?.insurance_cost, []),
      inwardEstimationCost: new FormControl(data?.inwardEstimationCost, []),
      maintainanceEstimationCost: new FormControl(
        data?.maintainanceEstimationCost,
        [],
      ),
    });
    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
    this.selectActionOnApproved();
    this.getList();
  
  }
  companyRepresentativeList: any = [];
  getCompanyRepresentativeList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('companyrepresentative', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.companyRepresentativeList = res.data;
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  typePurchaseList: any = [];
  getPurchaseList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('purchasetype', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.typePurchaseList = res.data;
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  selectActionOnApproved() {
    if (this.form.controls['approved_status'].value == 'APPROVED') {
      this.form.controls['purchanseDate'].setValidators([Validators.required]);
      this.form.controls['expectedDateOfArrival'].setValidators([
        Validators.required,
      ]);
      this.form.controls['typeOfPurchase'].setValidators([Validators.required]);
      this.form.controls['purchasePrice'].setValidators([Validators.required]);
      this.form.controls['amountTransferDate'].setValidators([
        Validators.required,
      ]);
      this.form.controls['parkLocation'].setValidators([Validators.required]);
      this.form.controls['companyRepresentative'].setValidators([
        Validators.required,
      ]);
      this.form.controls['rto_cost'].setValidators([Validators.required]);
      this.form.controls['insurance_cost'].setValidators([Validators.required]);
      this.form.controls['inwardEstimationCost'].setValidators([
        Validators.required,
      ]);
      this.form.controls['maintainanceEstimationCost'].setValidators([
        Validators.required,
      ]);
      this.form.updateValueAndValidity();
      if(this.tractor?.action_taken==1 && !this.newArrivalsDetails){
      this.setEstimationValue()
    }else if(this.tractor?.action_taken==1 && this.newArrivalsDetails?.id){
this.getFindingDetailsInNewArrivals()  
    }
    } else if (this.form.controls['approved_status'].value == 'REJECTED') {
      this.form.controls['purchanseDate'].clearValidators();
      this.form.controls['expectedDateOfArrival'].clearValidators();
      this.form.controls['typeOfPurchase'].clearValidators();
      this.form.controls['purchasePrice'].clearValidators();
      this.form.controls['amountTransferDate'].clearValidators();
      this.form.controls['parkLocation'].clearValidators();
      this.form.controls['companyRepresentative'].clearValidators();
      this.form.controls['rto_cost'].clearValidators();
      this.form.controls['insurance_cost'].clearValidators();
      this.form.controls['inwardEstimationCost'].clearValidators();
      this.form.controls['maintainanceEstimationCost'].clearValidators();
      this.form.updateValueAndValidity();
    }
    
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }

  async showModal(dataUpdate: any = null) {}
  saveExpense() {
    if (this.form.controls['approved_status'].value == 'REJECTED') {
      if (this.form.valid) {
        this.updateDataOnly();
      } else {
        this.share.presentToast('Please Fill Required Fields');
        this.form.markAllAsTouched();
      }
    } else if (this.form.valid) {
      if (this.tractor.action_taken == 0) {
        this.checkFindingDetails();
      } else if (
        this.tractor.action_taken == 1 &&
        this.tractor?.approved_status == 'REJECTED'
      ) {
        this.checkFindingDetails();
      } else {
        this.updateDataOnly(true);
      }
    } else {
      this.form.markAllAsTouched();
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  newArrivalsDetails:any=null
  getFindingDetailsInNewArrivals() {
 let obj: any = this.share.getStaffObj();
  
     obj.newFinding_id=this.tractor?.id,

    this.share.showLoading('GettingDetails');
 this.newArrivalsDetails=null
    this.api
      .postapi('checkFindingTractorInTractorList', obj)
      .subscribe((res: any) => {
        if (res?.data?.id) {
          this.newArrivalsDetails=res?.data
          this.form.controls['purchanseDate'].setValue(res?.data?.purchanseDate)
         this.form.controls['expectedDateOfArrival'].setValue(res?.data?.expectedDateOfArrival)  
         this.form.controls['typeOfPurchase'].setValue(res?.data?.typeOfPurchase)  
         this.form.controls['purchasePrice'].setValue(res?.data?.purchasePrice)  
         this.form.controls['amountTransferDate'].setValue(res?.data?.amountTransferDate)  
         this.form.controls['parkLocation'].setValue(res?.data?.parkLocation)  
         this.form.controls['companyRepresentative'].setValue(res?.data?.companyRepresentative)  
         this.form.controls['rto_cost'].setValue(res?.data?.rto_cost)  
         this.form.controls['insurance_cost'].setValue(res?.data?.insurance_cost)  
         this.form.controls['inwardEstimationCost'].setValue(res?.data?.inwardEstimationCost)  
         this.form.controls['maintainanceEstimationCost'].setValue(res?.data?.maintainanceEstimationCost)  
        

        } 
        this.share.spinner.dismiss()
      });
  }
  checkFindingDetails() {
    let obj: any = this.share.getStaffObj();
  
     obj.newFinding_id=this.tractor?.id,

    this.share.showLoading('Saving');
    this.api
      .postapi('checkFindingTractorInTractorList', obj)
      .subscribe((res: any) => {
        if (res?.data?.id) {
          let msg =
            'This Finding Already Approved Before.TF Code- ' +
            res?.data?.registractionNo;
          this.share.presentToast(msg);
          this.share.spinner.dismiss(true);
          this.updateNewFindings(res?.data,false)
        } else {
          this.onSaveTractor();
        }

        this.modalCtrl.dismiss(true, 'confirm');

        //this.view='LIST'
      });
  }
  updateDataOnly(updateNewArrival:any=false) {
    let obj = {
      src: 'new_findings',
      data: this.getActionValueObj(),
      id: this.tractor?.id,
    };
    this.share.showLoading('Saving');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.presentToast('Action Saved');
      this.share.spinner.dismiss(true);
if(updateNewArrival && this.newArrivalsDetails?.id){
  this.updateNewArrivals()
}
      this.modalCtrl.dismiss(true, 'confirm');

      //this.view='LIST'
    });
  }
    
  updateNewArrivals(){
    let objVal = {
      rto_cost: this.form.value?.rto_cost,
      insurance_cost: this.form.value?.insurance_cost,
      inwardEstimationCost: this.form.value?.inwardEstimationCost,
      maintainanceEstimationCost: this.form.value?.maintainanceEstimationCost,
  
    };
    let obj = {
      src: 'tractor',
      data: objVal,
      id: this.newArrivalsDetails?.id,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
     this.updatePurchaseDetails()
    });

  }
 
  updatePurchaseDetails(){
      let objVal = {
      parkLocation: this.form.value?.parkLocation,
      expectedDateOfArrival: this.form.value?.expectedDateOfArrival,
      amountTransferDate: this.form.value?.amountTransferDate,
      purchasePrice: this.form.value?.purchasePrice,
      purchanseDate: this.form.value?.purchanseDate,
      companyRepresentative: this.form.value?.companyRepresentative,
      typeOfPurchase: this.form.value?.typeOfPurchase,
  
    };
    let obj = {
      src: 'purchasedetail',
      data: objVal,
      id: this.newArrivalsDetails?.purchaseId,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
  this.share.presentToast("Updated New Arrivals Details")
    });
  }
  modelList: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Loading');
    this.api.postapi('getModelDataSanitized', obj).subscribe(
      (res: any) => {
        this.modelList = res.data;
        let modelSelected = this.modelList.find(
          (f: any) => f.id == this.tractor?.model_id,
        );
        if (modelSelected) {
          this.setModelDetailEvent(modelSelected);
        }
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }

  setModelDetailEvent(modelSelected: any) {
    this.modelForm = this.share.initialize(null, this.modelForm);
    setTimeout(() => {
      this.share.setModelDetail(modelSelected, this.modelForm);

      this.modelForm?.controls['hours'].setValue(this.tractor?.hours);
      this.modelForm?.controls['yearOfManufactoring'].setValue(
        this.tractor?.yearOfManufactoring,
      );

      let grp = this.modelForm.controls['purchasedetail'] as FormGroup;
      grp?.controls['chasisNumber'].setValue(this.tractor?.chassisNumber);
      grp?.controls['registrationNumber'].setValue(
        this.tractor?.registractionNo,
      );
      grp?.controls['engineNumber'].setValue(this.tractor?.engineNo);
      grp?.controls['dealer_id'].setValue(this.tractor?.dealerId);
      grp?.controls['purchasePrice'].setValue(Number(this.tractor?.finalPrice));
      grp?.updateValueAndValidity();
      this.modelForm.updateValueAndValidity();
      console.log('this.newTractorForm', this.modelForm.value);
    }, 0);
  }
  modelForm: FormGroup;

  loadedImages: any = [];
  upload: any = [];
  getSensObj(isDraft: any = true) {
    this.setBasicTractorDetails();
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
  setBasicTractorDetails() {
    let grp = this.modelForm.controls['purchasedetail'] as FormGroup;
    this.modelForm.updateValueAndValidity();
    let formVal = this.modelForm.value;
    this.modelForm.controls['rto_cost'].setValue(this.form.value?.rto_cost);
    this.modelForm.controls['insurance_cost'].setValue(
      this.form.value?.insurance_cost,
    );
    this.modelForm.controls['inwardEstimationCost'].setValue(
      this.form.value?.inwardEstimationCost,
    );
    this.modelForm.controls['maintainanceEstimationCost'].setValue(
      this.form.value?.maintainanceEstimationCost,
    );
    grp.controls['parkLocation'].setValue(this.form.value?.parkLocation);
    grp.controls['expectedDateOfArrival'].setValue(
      this.form.value?.expectedDateOfArrival,
    );
    grp.controls['amountTransferDate'].setValue(
      this.form.value?.amountTransferDate,
    );
    grp.controls['purchasePrice'].setValue(this.form.value?.purchasePrice);
    grp.controls['purchanseDate'].setValue(this.form.value?.purchanseDate);
    grp.controls['companyRepresentative'].setValue(
      this.form.value?.companyRepresentative,
    );
    grp.controls['typeOfPurchase'].setValue(this.form.value?.typeOfPurchase);
    grp.updateValueAndValidity();
    this.modelForm.updateValueAndValidity();
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
          this.updateTractorData(this.newTractorDetails);
        },

        (error: any) => {
          //  this.loader = false;
        },
      );
    } else {
      //this.share.openSnackbarValidationError();
      this.share.presentToast('Please Fill Required Fields');
    }
  }
  updateTractorData(newTractor: any) {
    let objVal = {
      isFromNewFindings: true,
      newFindingId: this.tractor?.id,
    };
    let obj = {
      src: 'tractor',
      data: objVal,
      id: newTractor?.id,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.updateNewFindings(newTractor);
    });
  }
  updateNewFindings(newTractor: any,addNew=true) {
    let objVal: any = this.getActionValueObj();

    objVal.approved_tractor_id = newTractor?.id;
    let obj = {
      src: 'new_findings',
      data: objVal,
      id: this.tractor?.id,
    };
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      if(addNew){
 this.share.presentToast('Action Submitted,Tractor Added in New Arrivals');
      }else{
         this.share.presentToast('Action Submitted,But No Tractor Added');
      }
     
      this.share.spinner.dismiss();

      this.modalCtrl.dismiss(true, 'confirm');
    });
  }
  checkValidation() {
    let status = false;
    this.modelForm.updateValueAndValidity();
    if (this.modelForm.valid) {
      status = true;
    } else {
      status = false;
    }

    return status;
  }
}
