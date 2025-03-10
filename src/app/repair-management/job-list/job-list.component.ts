import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent  implements OnInit {

  constructor(private share:ShareService,private api:ApiService,private router:Router) { }
  search:any={ tfCode: '', regNumber:''}
  ngOnInit() {}
jobList:any=[]
refreshList(){
this.getJobList()
}

ionViewWillEnter() {
  this.jobList = [];
  this.getJobList();
}
staffDetails:any
getJobList(){
 
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isCompleted: false,
    };
    this.share.showLoading('Loading');
    this.api.postapi('jobList', obj).subscribe(
      (res: any) => {
        this.jobList = res.data;
    console.log("jobList",this.jobList);
    
        this.share.spinner.dismiss();
      
      },
      (error: any) => {}
    );
  
}
openEdit(job:any){
 this.router.navigate(['/repair-management/update-job', job?.id,'/repair-management/job-list']);
}
}
