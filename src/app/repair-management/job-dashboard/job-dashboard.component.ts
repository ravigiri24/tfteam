import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-job-dashboard',
  templateUrl: './job-dashboard.component.html',
  styleUrls: ['./job-dashboard.component.scss'],
})
export class JobDashboardComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  createJob(){
    this.router.navigate(['/repair-management/create-job','/repair-management/job-dashboard'])
  }
}
