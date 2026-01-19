import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tarritory-manager-footer',
  templateUrl: './tarritory-manager-footer.component.html',
  styleUrls: ['./tarritory-manager-footer.component.scss'],
})
export class TarritoryManagerFooterComponent  implements OnInit {
 constructor(private router: Router) { }
  // Code  update by pinku
  // selectedTab: string = 'NOC'; // Default selected tab

  activeTabsColor = "fourthColor";

  ngOnInit() {

  }

 
  selectedTab: any = 'Enquiry';

  goToPage(tab: any) {
    this.selectedTab = tab

        if(tab == 'Enquiry') {
      this.activeTabsColor = "fourthColor";
      this.router.navigate(['/tarritory-manager/tarritory-manager-enquiry-list']);
    }
      if(tab == 'Approvals') {
      this.activeTabsColor = "firstColor";
      this.router.navigate(['/tarritory-manager/tarritory-manager-approval-list']);
    }
     if(tab=='TRACTORS'){
   this.activeTabsColor = "sixColor";
    this.router.navigate(['/tarritory-manager/tarritory-manager-tractor-list'])
  }
    else if (tab == 'User') {
      this.activeTabsColor = "thirdColor";
      this.router.navigate(['/tarritory-manager/user-management']);
    }
    
  
  }
}
