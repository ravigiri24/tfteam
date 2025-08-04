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
  activeTabsColor="firstColor"
  selectedTab:any='Job-dashboard'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='Job-dashboard'){
    this.activeTabsColor='firstColor'
    this.router.navigate(['/repair-management/job-dashboard'])
  }
  if(tab=='Job-List'){
       this.activeTabsColor='secondColor'
    this.router.navigate(['/repair-management/job-list'])
  }
  if(tab=='Reports'){
       this.activeTabsColor='fourthColor'
    this.router.navigate(['/repair-management/report-dashboard'])
  }


  else if(tab=='User'){
        this.activeTabsColor='thirdColor'
    this.router.navigate(['/repair-management/user-management'])
  }
  
  }
}
