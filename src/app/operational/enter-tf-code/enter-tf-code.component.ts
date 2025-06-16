import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-enter-tf-code',
  templateUrl: './enter-tf-code.component.html',
  styleUrls: ['./enter-tf-code.component.scss'],
})
export class EnterTfCodeComponent  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController
  ) {}
  tractorDetails: any;
  ngOnInit() {
    this.getLastTFCode()
    this.initialize(this.tractorDetails);
  }

  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.fb.group({
      registractionNo: new FormControl(data?.registractionNo || null, [
        Validators.required,
      ]),
    });
  }
  staffDetails:any
  lastAssigned:any
  getLastTFCode(){
   let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
    
    };
    this.share?.showLoading('Loading...');
    this.api.postapi('getLastAssignedTFCode', obj).subscribe(
      (res: any) => {
        this.lastAssigned = res?.data?.tfCode;
     this.generateNewOne()
      //  this.sortByFilter();

        this.share?.spinner?.dismiss();
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  newOneDigit:any
  generateNewOne(){
    let arrayOFTF= this.lastAssigned.split("-")
    let oldDigit=arrayOFTF[arrayOFTF?.length-1]
    let newOne:any=Number(oldDigit)+1
    if((newOne).toString()?.length<4){
newOne='0'+newOne
    }
    this.newOneDigit='TF-'+newOne
    this.form.controls['registractionNo'].setValue(this.newOneDigit)
    console.log("generateNewOne",arrayOFTF);
    
  }
  updateItem() {
    if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractorDetails?.id,
      };
      this.share.showLoading('Updating Details...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        if(res?.status){
     this.addGenerateRecord()
        }
   
     
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
  addGenerateRecord(){
      let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
       let obj = {
        src: 'tfcodegenerationrecord',
        data: {
          tractor_id:this.tractorDetails?.id,
          tfCode:this.form.value?.registractionNo,
          actionByid:this.staffDetails?.id
        },
        id: this.tractorDetails?.id,
      };
    
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
      this.share.presentToast('Details Saved...');
      this.modalCtrl.dismiss({isActioned:true});
      });
  }

}
