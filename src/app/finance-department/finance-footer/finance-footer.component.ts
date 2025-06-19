import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-finance-footer',
  templateUrl: './finance-footer.component.html',
  styleUrls: ['./finance-footer.component.scss'],
})
export class FinanceFooterComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='Sold'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='Sold'){
    this.router.navigate(['/finance-department/sold-tractor'])
  }

  else if(tab=='Financed'){
    this.router.navigate(['/finance-department/financed-tractor'])
  }

  else if(tab=='User'){
    this.router.navigate(['/finance-department/user-management'])
  }
  
  }
}
