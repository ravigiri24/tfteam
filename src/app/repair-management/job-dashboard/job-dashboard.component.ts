import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.component.html',
  styleUrls: ['./job-dashboard.component.scss'],
})
export class JobDashboardComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService,private api:ApiService) { }

  ngOnInit() {}
  staffDetails:any
  jobData:any
  ionViewWillEnter() {
  
    this.getJobData();
  }
  getJobData() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
 
    };
    this.share.showLoading('Loading');
    this.api.postapi('getJobTally', obj).subscribe(
      (res: any) => {
        this.jobData = res.data;
        console.log('jobData', this.jobData);

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  createJob(){
    this.router.navigate(['/repair-management/create-job','/repair-management/job-dashboard'])
  }
}
