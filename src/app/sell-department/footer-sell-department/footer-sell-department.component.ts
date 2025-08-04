import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer-sell-department',
  templateUrl: './footer-sell-department.component.html',
  styleUrls: ['./footer-sell-department.component.scss'],
})
export class FooterSellDepartmentComponent  implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='Live'
  activeTabsColor='firstColor'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='Live'){
    this.activeTabsColor='firstColor'
    this.router.navigate(['/sell-department/live-tractor-list'])
  }

  else if(tab=='Sold'){
        this.activeTabsColor='secondColor'
    this.router.navigate(['/sell-department/sold-tractor-list'])
  }

  else if(tab=='User'){
           this.activeTabsColor='thirdColor'
    this.router.navigate(['/sell-department/user-management'])
  }
  
  }
}
