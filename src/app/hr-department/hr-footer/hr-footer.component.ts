import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hr-footer',
  templateUrl: './hr-footer.component.html',
  styleUrls: ['./hr-footer.component.scss'],
})
export class HrFooterComponent  implements OnInit {

 
   constructor(private router:Router) { }
 
   ngOnInit() {}
   selectedTab:any='New-arrivals'
   goToPage(tab:any){
   this.selectedTab=tab
   if(tab=='Offer-letter'){
     this.router.navigate(['/hr-deparment/offer-letter'])
   }
   else if(tab=='Salary-Slips'){
     this.router.navigate(['/hr-deparment/salary-slip'])
   }

   
   // else if(tab=='Report'){
   //   this.router.navigate(['/digital//report-management'])
   // }
   else if(tab=='User'){
     this.router.navigate(['/hr-deparment/user-management'])
   }
   
   }

}
