import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-repair-footer',
  templateUrl: './repair-footer.component.html',
  styleUrls: ['./repair-footer.component.scss'],
})
export class RepairFooterComponent  implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='Job-dashboard'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='Job-dashboard'){
    this.router.navigate(['/repair-management/job-dashboard'])
  }

  else if(tab=='User'){
    this.router.navigate(['/repair-management/user-management'])
  }
  
  }
}
