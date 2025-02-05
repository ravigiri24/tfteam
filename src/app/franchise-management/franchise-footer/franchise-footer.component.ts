import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-franchise-footer',
  templateUrl: './franchise-footer.component.html',
  styleUrls: ['./franchise-footer.component.scss'],
})
export class FranchiseFooterComponent  implements OnInit {

   constructor(private router:Router) { }
 
   ngOnInit() {}
   selectedTab:any='New-Tractor'
   goToPage(tab:any){
   this.selectedTab=tab
   if(tab=='New-Tractor'){
     this.router.navigate(['/franchise-management/new-tractor'])
   }
   else if(tab=='STORE_TRACTOR'){
     this.router.navigate(['/franchise-management/store-tractor'])
   }
   else if(tab=='STORE_TRANSACTION'){
     this.router.navigate(['/franchise-management/store-transaction'])
   }

   else if(tab=='User'){
     this.router.navigate(['/franchise-management/user-management'])
   }
   
   }
}
