import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rto-footer',
  templateUrl: './rto-footer.component.html',
  styleUrls: ['./rto-footer.component.scss'],
})
export class RtoFooterComponent implements OnInit {
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
  selectedTab: any = 'NOC';

  goToPage(tab: any) {
    this.selectedTab = tab
    if (tab == 'NOC') {
      this.activeTabsColor = "firstColor";
      this.router.navigate(['/rto-department/rto-noc']);
    }
    else if (tab == 'Sold_Process') {
      this.activeTabsColor = "secondColor";
      this.router.navigate(['/rto-department/rto-sold-process']);
    }
    else if (tab == 'User') {
      this.activeTabsColor = "thirdColor";
      this.router.navigate(['/rto-department/user-management']);
    }
  }
}
