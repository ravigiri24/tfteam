/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.component.html',
  styleUrls: ['./job-dashboard.component.scss'],
})
export class JobDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private share: ShareService,
    private api: ApiService,
  ) {}

  ngOnInit() {}
  staffDetails: any;
  jobData: any;
  @Input() listColorClass = 'firstColor';
  ionViewWillEnter() {
     this.showRefurbish = false;
     this.showService = false;
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.getJobData();
    this.getRepairCenter();
  }

  getRepairCenter() {
    let obj = this.share.getListObj('repairing_center', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.repairCenterList = res?.data;
        let find = this.repairCenterList.find(
          (f: any) => f.id == this.staffDetails?.repair_center,
        );
        let repairing_types=JSON.parse( find?.repairing_types)
        if (
          repairing_types?.filter((f: any) => f == 'REFURBISH')?.length
        ) {
          this.showRefurbish = true;
        }
        if (repairing_types?.filter((f: any) => f == 'SERVICE')?.length) {
          this.showService = true;
        }
      },
      (error: any) => {},
    );
  }
  showRefurbish = false;
  showService = false;
  repairCenterList: any = [];
  getJobData() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      repair_center: this.staffDetails?.repair_center,
    };
    this.share.showLoading('Loading');
    this.api.postapi('getJobTally', obj).subscribe(
      (res: any) => {
        this.jobData = res.data;
        console.log('jobData', this.jobData);

        this.share.spinner.dismiss('active_one');
      },
      (error: any) => {},
    );
  }
  jobList(type: any) {
    //  this.router.navigate(['/repair-management/job-list',type])
  }
  createJob() {
    this.router.navigate([
      '/repair-management/create-job',
      '/repair-management/job-dashboard','REFURBISH',
    ]);
  }
    createService() {
    this.router.navigate([
      '/repair-management/create-job',
      '/repair-management/job-dashboard','SERVICE',
    ]);
  }
}
