import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lead-footer',
  templateUrl: './lead-footer.component.html',
  styleUrls: ['./lead-footer.component.scss'],
})
export class LeadFooterComponent  implements OnInit {
  constructor(private router: Router) { }
  // Code  update by pinku
  // selectedTab: string = 'NOC'; // Default selected tab
  isNocAvailable: boolean = false; // Default NOC status
  itCode: string = 'IT-042'; // Your IT code
  activeTabsColor = "firstColor";

  ngOnInit() {
    this.checkNocStatus();
  }

  checkNocStatus() {
    setTimeout(() => {
      this.isNocAvailable = Math.random() > 0.5;
    }, 1000);
  }
  selectedTab: any = 'CUSTOMER_LIST';

  goToPage(tab: any) {
    this.selectedTab = tab
    if (tab == 'CUSTOMER_LIST') {
      this.activeTabsColor = "fifthColor";
      this.router.navigate(['/lead-management/customer-management']);
    }
    else if (tab == 'Follow-Up') {
      this.activeTabsColor = "sixColor";
      this.router.navigate(['/lead-management/follow-up-management']);
    }
     else if(tab=='Visitng'){
      this.activeTabsColor = "sevenColor";
      this.router.navigate(['/lead-management/visiting-management']);
      
    }
    else if (tab == 'User') {
      this.activeTabsColor = "thirdColor";
      this.router.navigate(['/lead-management/user-management']);
    }
   
  }
}
