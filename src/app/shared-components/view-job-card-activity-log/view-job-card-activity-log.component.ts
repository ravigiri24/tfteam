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
@Component({
  selector: 'app-view-job-card-activity-log',
  templateUrl: './view-job-card-activity-log.component.html',
  styleUrls: ['./view-job-card-activity-log.component.scss'],
})
export class ViewJobCardActivityLogComponent  implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  listColorClass: any = 'firstColor';
  dismiss() {
    this.modalCtrl.dismiss();
  }
staffDetails:any
  ngOnInit() {
       let staffDetails: any = this.share.get_staff();
       this.staffDetails = JSON.parse(staffDetails);
       this.getNotification()
  }

  noti_list:any=[]
getNotification(){
      let obj: any = this.share.getStaffObj();
    
       obj.staff_id= this.staffDetails?.id
this.share.showLoading("Getting Logs")
      this.api.postapi('getRepairActivityLog', obj).subscribe(
        (res: any) => {
    this.noti_list=res?.data
 

        this.share.spinner.dismiss()
        },
        (error: any) => {
        
        }
      );

  }
}
