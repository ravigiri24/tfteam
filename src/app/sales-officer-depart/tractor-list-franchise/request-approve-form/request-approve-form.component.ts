import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';



@Component({
  selector: 'app-request-approve-form',
  templateUrl: './request-approve-form.component.html',
  styleUrls: ['./request-approve-form.component.scss'],
})
export class RequestApproveFormComponent  implements OnInit {

  approvalData: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) { }
  staffDetails: any;
  selectedStore:any
  @Input() listColorClass = 'sixColor';
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    //     let selectedStore: any = this.share.get_sales_officer_store();
    // console.log('staffDetails', staffDetails);
    // this.selectedStore = JSON.parse(selectedStore);

    this.initialize(this.approvalData);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
tractor:any

  formWarehouse: FormGroup;
  initialize(data: any = null) {

    let store_id = this.selectedStore

    this.form = this.formBuilder.group({
      tractor_id: new FormControl(this.tractor?.id, [Validators.required]),
      approvePrice: new FormControl(data?.approvePrice, [Validators.required]),
      expectedDateOfSale: new FormControl(data?.approvePrice, []),
      remark: new FormControl(data?.remark, []),
  
      storeId: new FormControl(data?.storeId || store_id, [Validators.required]),
      actionByid: new FormControl(this?.staffDetails?.id, [Validators.required]),
      requestBy: new FormControl(this?.staffDetails?.id, [Validators.required]),

    });

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  getModel() {
    let valueOf = this.form.controls['modal_ids']?.value || [];
    return valueOf
  }
 




  save() {
    if (this.form.valid) {
       let objVal=this.form.value
    let obj = {
        src: 'approvalfortractor',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Request Sent Successfully...');

this.modalCtrl.dismiss(true)
        //  this.dismiss();
      });
    } else {
      if (!this.form.valid) {
        this.share.presentToast("Please Fill Required Fields")
      }


    }
  }
  update() {
    if (this.form.valid) {
      let obj: any = this.form.value
      obj.operate = this.share.getStaffObj()?.operate;
      obj.id = this.approvalData?.id
      this.share.showLoading('Updating...');

      this.api.postapi('updateEnquiry', obj).subscribe(
        (res: any) => {
          this.share.presentToast("Enquiry Updated Successfully")
          this.share.spinner.dismiss()

          this.modalCtrl.dismiss(true)
        },
        (error: any) => { }
      );
    } else {
      if (!this.form.valid) {
        this.share.presentToast("Please Fill Required Fields")
      }


    }
  }
  deleteModel(model: any) {
    let valueOf = this.form.controls['modal_ids'].value;
    let findIn = valueOf?.findIndex((f: any) => f.id == model?.id)
    valueOf.splice(findIn, 1)
    this.form.controls['modal_ids'].setValue(valueOf)
  }
  updates() {

  }
}
