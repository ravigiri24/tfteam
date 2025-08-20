import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-franchise-operation-footer',
  templateUrl: './franchise-operation-footer.component.html',
  styleUrls: ['./franchise-operation-footer.component.scss'],
})
export class FranchiseOperationFooterComponent  implements OnInit {

     constructor(private router:Router) { }
     activeTabsColor = "firstColor";
     ngOnInit() {}
     selectedTab:any='Branch-wise-tractor'
     goToPage(tab:any){
     this.selectedTab=tab
     if(tab=='Branch-wise-tractor'){
         this.activeTabsColor = "firstColor";
       this.router.navigate(['/franchise-operation-deparment/branchwise-tractor-list'])
     }
  
     else if(tab=='User'){
      this.activeTabsColor = "thirdColor";
       this.router.navigate(['/franchise-operation-deparment/user-management'])
     }
     
     }
}
