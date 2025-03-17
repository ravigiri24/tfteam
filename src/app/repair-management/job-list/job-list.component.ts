import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { RepairDashboardComponent } from '../repair-dashboard/repair-dashboard.component';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  constructor(
    private share: ShareService,
    private api: ApiService,
    private router: Router,
    private modalControl: ModalController,
    private alertCtrl:AlertController
  ) {}
  search: any = { tfCode: '', regNumber: '' };
  ngOnInit() {}
  jobList: any = [];
  refreshList() {
    this.getJobList();
  }
  async deleteItem(job: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Job',
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
      this.deleteJobApi(job);
    }
  }
 
  deleteJobApi(job: any) {
    let obj = {
      src: 'repairing_record',
      data: { isDeleted: true },
      id: job?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
      this.getJobList()
   
    });
  }
  async openRepairDashboard(job:any) {
    this.router.navigate([
      '/repair-management/repair-dashboard',
      job?.id,
      '/repair-management/job-list',
    ]);


  }
  ionViewWillEnter() {
    this.jobList = [];
    this.jobType=false
    this.getJobList();
  }
  staffDetails: any;
  jobType=false
  getJobList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isCompleted: this.jobType,
    };
    this.share.showLoading('Loading');
    this.api.postapi('jobList', obj).subscribe(
      (res: any) => {
        this.jobList = res.data;
        console.log('jobList', this.jobList);

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  openEdit(job: any) {
    this.router.navigate([
      '/repair-management/update-job',
      job?.id,
      '/repair-management/job-list',
    ]);
  }
  openDashboard() {}
}
