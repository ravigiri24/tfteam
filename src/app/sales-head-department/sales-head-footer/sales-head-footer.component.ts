import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sales-head-footer',
  templateUrl: './sales-head-footer.component.html',
  styleUrls: ['./sales-head-footer.component.scss'],
})
export class SalesHeadFooterComponent  implements OnInit {

  constructor(private router: Router) { }
  // Code  update by pinku
  // selectedTab: string = 'NOC'; // Default selected tab

  activeTabsColor = "fourthColor";

  ngOnInit() {

  }

 
  selectedTab: any = 'Dashboard';

  goToPage(tab: any) {
    this.selectedTab = tab
    if (tab == 'Dashboard') {
      this.activeTabsColor = "fourthColor";
      this.router.navigate(['/sales-head/sales-head-dashboard']);
    }
   
    else if (tab == 'User') {
      this.activeTabsColor = "thirdColor";
      this.router.navigate(['/sales-head/user-management']);
    }
  
  }
}
