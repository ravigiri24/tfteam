import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
})
export class JobCardComponent  implements OnInit {
@Input() jobDetails:any
@Input() expenseServiceList:any=[]
@Input() expenseMaterialList:any=[]
@Input() expenseServiceCost:any=0
@Input() isJobDone: any =false

@Input() expenseMaterialCost:any=0
  constructor(private alertCtrl:AlertController,private share:ShareService,private api:ApiService,private router:Router) { }

  ngOnInit() {}

  async actionJob(msg:any,status:any) {
    const alert = await this.alertCtrl.create({
      header: msg,
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.completeJob(status);
    }
  }
 
  completeJob(status:any) {
    let obj = {
      src: 'repairing_record',
      data: { isCompleted: status },
      id: this.jobDetails?.id,
    };

    this.share.showLoading('Closing Job...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Closed Successfully...');
      this.router.navigate(['/repair-management/job-list'])
     
 
    });
  }
}
