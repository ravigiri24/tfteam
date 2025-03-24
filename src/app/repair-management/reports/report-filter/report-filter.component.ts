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

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent  implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  reportType:any="Job List"
  ngOnInit() {
    this.initialize()
  }
  
  initialize(){

    this.form=this.formBuilder.group({
      startDate: new FormControl( null, [
        Validators.required,
      ]),
      endDate: new FormControl( null, [
        Validators.required,
      ]),
    })
    console.log("this.dateForm",this.form.value);
    
  }
  form:FormGroup
  dismiss() {
    return this.modalCtrl.dismiss(null);
  }
 
  dateValue(){
if(this.form.valid){
    if(this.form.controls['startDate'].value<=this.form.controls['endDate'].value){
      console.log("this.dateForm",this.form.value);
    }else{
this.share.presentToast("Error:End Date is less than Start Date")
    }
  }else{
    this.share.presentToast("Error:Please Fill Required(*) Fields")
  }
  }
}
