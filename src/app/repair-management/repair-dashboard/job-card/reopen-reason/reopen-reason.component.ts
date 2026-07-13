import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { AlertController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-reopen-reason',
  templateUrl: './reopen-reason.component.html',
  styleUrls: ['./reopen-reason.component.scss'],
})
export class ReopenReasonComponent  implements OnInit {
  constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }
  dismiss() {
    this.modalCtrl.dismiss()
  }
  @Input() listColorClass = 'secondColor';
  ngOnInit() {
    if (this.jobDetails?.remark) {
      this.reason = this.jobDetails?.remark
    }
  }
  staffDetails:any
  jobDetails: any
  reason: any
  reopen() {
    //  this.modalcontrol.dismiss(true);
    if (this.reason != null && this.reason != undefined && this.reason!='') {
      let    data={ isCompleted: false,isReopened:true };
      
      let obj = {
        src: 'repairing_record',
        data: data,
        id: this.jobDetails?.id,
      };

      this.share.showLoading('Reopen Data');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {

   this.reopenTractor()
        this.share.presentToast('Reopened Successfully...');
        this.share.spinner.dismiss();
           let description =
            this.staffDetails?.name +
            ' has reopen the job card TF Code- '+this.jobDetails?.tfCode+ ' at ' +
            'the repair center';
          this.api.genreteJobCardNotification(
            'Job Card Reopen',
            description,
          this.staffDetails
          );


        //  this.dismiss();
      });
    } else {
      this.share.presentToast('Please Enter Reason');
    }
  }

  reopenTractor(){
        if (this.reason != null && this.reason != undefined) {
        let staffDetails: any = this.share.get_staff();
  
      this.staffDetails = JSON.parse(staffDetails);
          let obj = {
        src: 'jobreopenhistory',
        data: { job_id: this.jobDetails?.id, startDate: new Date(),reason:this.reason,reoopenedBy:this.staffDetails?.id},
  
      };

      this.share.showLoading('Reopening Job...');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
      
        this.share.presentToast('Reopen Successfully...');
      this.modalCtrl.dismiss(true)
      });
    }
     else {
      this.share.presentToast('Please Enter Reason');
    }
    }
}
