import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rto-footer',
  templateUrl: './rto-footer.component.html',
  styleUrls: ['./rto-footer.component.scss'],
})
export class RtoFooterComponent  implements OnInit {
 constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='NOC'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='NOC'){
    this.router.navigate(['/rto-department/rto-noc'])
  }

  else if(tab=='Sold_Process'){
    this.router.navigate(['/rto-department/rto-sold-process'])
  }

  else if(tab=='User'){
    this.router.navigate(['/rto-department/user-management'])
  }
  
  }
}
