import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-footer',
  templateUrl: './account-footer.component.html',
  styleUrls: ['./account-footer.component.scss'],
})
export class AccountFooterComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='TRACTOR-ACCOUNT'
   activeTabsColor='secondColor'
  goToPage(tab:any){
  this.selectedTab=tab
 
  if(tab=='TRACTOR-ACCOUNT'){
    this.activeTabsColor='secondColor'
    this.router.navigate(['/account-department/account-tractor'])
  }

  else if(tab=='ACCOUNT-DASHBOARD'){
       this.activeTabsColor='sevenColor'
     this.router.navigate(['/account-department/account-dashboard'])
  }

  

  else if(tab=='User'){
          this.activeTabsColor='thirdColor'
    this.router.navigate(['/account-department/user-management'])
  }
  
  }
}

