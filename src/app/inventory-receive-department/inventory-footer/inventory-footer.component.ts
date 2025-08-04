import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inventory-footer',
  templateUrl: './inventory-footer.component.html',
  styleUrls: ['./inventory-footer.component.scss'],
})
export class InventoryFooterComponent  implements OnInit {

  
   constructor(private router:Router) { }
 
   ngOnInit() {}
   selectedTab:any='Received Inventory'
   activeTabsColor='sixColor'
   goToPage(tab:any){
   this.selectedTab=tab
   if(tab=='Received Inventory'){
    this.activeTabsColor='sixColor'
     this.router.navigate(['/inventory-receive-department/inven-received-list'])
   }


   
   // else if(tab=='Report'){
   //   this.router.navigate(['/digital//report-management'])
   // }
   else if(tab=='User'){
    this.activeTabsColor='thirdColor'
     this.router.navigate(['/inventory-receive-department/user-management'])
   }
   
   }

}
