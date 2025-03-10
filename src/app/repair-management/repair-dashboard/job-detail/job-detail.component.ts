import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  @Input() jobDetails: any;
  @Input() inventoryList: any = [];
  @Input() issueList: any = [];
  @Input() inventoryArray: any = [];
  @Input() issueArray: any = [];
  constructor(
    private alertCtrl: AlertController,
    private api: ApiService,
    private share: ShareService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {}

  async updateOtherStatus() {
    if (this.jobDetails.isOtherIssueDone==1) {
      const alert = await this.alertCtrl.create({
        header: 'Reopen Issue?',
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
        this.updateOtherIssue(false,0);
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Issue Fixed?',
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
        this.updateOtherIssue(true,1);
      }
    }
  }
  async completeJob(issue: any) {
    if (!issue.isCompleted) {
      const alert = await this.alertCtrl.create({
        header: 'Issue Fixed?',
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
        let getTask = this.jobDetails?.completedIssues || [];
        getTask.push(issue?.id);
        this.taskAction(issue, true, getTask);
      }
      console.log('resut', result);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Reopen Issue?',
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
        let getTask = this.jobDetails?.completedIssues || [];
        getTask = getTask.filter((gF: any) => gF != issue?.id);
        this.taskAction(issue, false, getTask);
      }
      console.log('resut', result);
    }
  }
  updateOtherIssue(status: any,number:any) {
    let obj = {
      src: 'repairing_record',
      data: { isOtherIssueDone: status },
      id: this.jobDetails?.id,
    };

    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.jobDetails.isOtherIssueDone = number;

        this.share.presentToast('Done');
      },
      (error: any) => {}
    );
  }
  taskAction(issue: any, action: any, getTask: any = []) {
    let obj: any = this.share.getListObj('repairing_record', false, [], true);
    obj.completedIssues = getTask;
    obj.jobId = this.jobDetails?.id;
    this.api.postapi('taskAction', obj).subscribe(
      (res: any) => {
        this.jobDetails.completedIssues = res?.data;
        issue.isCompleted = action;
        this.getIssueName();
        this.share.presentToast('Done');
      },
      (error: any) => {}
    );
  }
  getIssueName() {
    this.issueArray = [];
    this.jobDetails.issueOptions?.forEach((f: any) => {
      let find = this.issueList.find((inv: any) => inv.id == f);
      if (find) {
        this.issueArray.push(find);
      }
    });
  }
}
