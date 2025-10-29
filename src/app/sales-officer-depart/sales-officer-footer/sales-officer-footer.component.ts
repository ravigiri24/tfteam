import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-officer-footer',
  templateUrl: './sales-officer-footer.component.html',
  styleUrls: ['./sales-officer-footer.component.scss'],
})
export class SalesOfficerFooterComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='TRACTORS'
    activeTabsColor = "firstColor";
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='TRACTORS'){
   this.activeTabsColor = "firstColor";
    this.router.navigate(['/sales-officer/tractor-list-francise'])
  }

  else if(tab=='User'){
         this.activeTabsColor = "thirdColor";
    this.router.navigate(['/sales-officer/user-management'])
  }
  
  }
}
