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
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='Live'){
    this.router.navigate(['/sell-department/live-tractor-list'])
  }

  else if(tab=='Sold'){
    this.router.navigate(['/sell-department/sold-tractor-list'])
  }

  else if(tab=='User'){
    this.router.navigate(['/sell-department/user-management'])
  }
  
  }
}
