import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-franchise-operation-footer',
  templateUrl: './franchise-operation-footer.component.html',
  styleUrls: ['./franchise-operation-footer.component.scss'],
})
export class FranchiseOperationFooterComponent  implements OnInit {

     constructor(private router:Router) { }
   
     ngOnInit() {}
     selectedTab:any='Ready-Tractor'
     goToPage(tab:any){
     this.selectedTab=tab
     if(tab=='Ready-Tractor'){
       this.router.navigate(['/franchise-operation-deparment/ready-tractor-sales'])
     }
  
     else if(tab=='User'){
       this.router.navigate(['/franchise-operation-deparment/user-management'])
     }
     
     }
}
