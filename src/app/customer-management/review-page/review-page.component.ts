import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
})
export class ReviewPageComponent  implements OnInit {

  constructor(private fb:FormBuilder,private share:ShareService,private api:ApiService,private modalCtl:ModalController) { }
  staffDetails:any
  customer:any
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.initializeNextDate(this.customer)
  }
  cancel(){
this.modalCtl.dismiss()
  }
    followLoader:any=false
    nextFollowupDate() {
      if (this.nextScheduleForm.valid) {
        this.followLoader = true;
        let obj = {
          src: 'customer_lead_chats',
          data: this.nextScheduleForm.value,
        };
        this.share.showLoading('Scheduling ...')
        this.api.postapi('addOpp', obj).subscribe((res:any) => {
          this.followLoader = false;
          this.share.spinner?.dismiss();
        this.share.presentToast("Scheduled Successfully...")
          this.nextScheduleForm.controls['status'].reset();
      
        });
      }
    }
    nextScheduleForm:FormGroup
    initializeNextDate(customer:any) {
      this.nextScheduleForm = this.fb.group({
        next_lead_date: new FormControl( null, [Validators.required]),
        customer_id: new FormControl(customer?.id || null, [
          Validators.required,
        ]),
        chat_type: new FormControl("FOLLOW_UP_DATE", [
          Validators.required,
        ]),
        employeId: new FormControl(this.staffDetails?.staffCode || null, [
          Validators.required,
        ]),
      });
  
      // if(data){
      //   this.form.addControl(
      //     'id',
      //     new FormControl(data?.id || null, [Validators.required])
      //   );
      // }
    }

}
