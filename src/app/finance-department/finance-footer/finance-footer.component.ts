import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-finance-footer',
  templateUrl: './finance-footer.component.html',
  styleUrls: ['./finance-footer.component.scss'],
})
export class FinanceFooterComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='Sold'
   activeTabsColor='fourthColor'
  goToPage(tab:any){
  this.selectedTab=tab
 
  if(tab=='Sold'){
    this.activeTabsColor='fourthColor'
    this.router.navigate(['/finance-department/sold-tractor'])
  }

  else if(tab=='Financed'){
       this.activeTabsColor='sevenColor'
    this.router.navigate(['/finance-department/financed-tractor'])
  }

  else if(tab=='User'){
          this.activeTabsColor='thirdColor'
    this.router.navigate(['/finance-department/user-management'])
  }
  
  }
}
