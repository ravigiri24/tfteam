import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-footer',
  templateUrl: './purchase-footer.component.html',
  styleUrls: ['./purchase-footer.component.scss'],
})
export class PurchaseFooterComponent  implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='New-findings'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='New-findings'){
    this.router.navigate(['/purchase-management/new-findings'])
  }
  else if(tab=='Cost-prediction'){
    this.router.navigate(['/purchase-management/cost-prediction'])
  }
  else if(tab=='Store-Transaction'){
    this.router.navigate(['/purchase-management/store-Transaction'])
  }


  // else if(tab=='Report'){
  //   this.router.navigate(['/digital//report-management'])
  // }
  else if(tab=='User'){
    this.router.navigate(['/purchase-management/user-management'])
  }
  
  }
}
