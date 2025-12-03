import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-reports-tractor',
  templateUrl: './reports-tractor.component.html',
  styleUrls: ['./reports-tractor.component.scss'],
})
export class ReportsTractorComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService,private api:ApiService) { }

  ngOnInit() {}
  staffDetails:any
  jobData:any
  ionViewWillEnter() {
  
   // this.getJobData();
  }
  getJobData() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      repair_center:this.staffDetails?.repair_center
 
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
  masterSheet(){
    this.router.navigate(['/admin-block/master-sheet','/admin-block/reports-tractor'])
  }
    workSheet(){
    this.router.navigate(['/admin-block/work-sheet','/admin-block/reports-tractor'])
  }
  leadManagement(){
       this.router.navigate(['/admin-block/lead-mgmt-employee','/admin-block/reports-tractor'])
    
  }
    storeManagement(){
       this.router.navigate(['/admin-block/sales-manager-list','/admin-block/reports-tractor'])
    
  }
     TeamManagement(){
       this.router.navigate(['/admin-block/team-manager-list','/admin-block/reports-tractor'])
    
  }
    goToTm() {
    this.router.navigate(['/admin-block/team-manager', '/admin-block/reports-tractor'])
  }
  goToSo(){
    this.router.navigate(['/admin-block/sales-officer','/admin-block/reports-tractor']);
  }
}
