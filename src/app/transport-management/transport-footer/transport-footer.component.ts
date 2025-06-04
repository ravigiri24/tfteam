import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-transport-footer',
  templateUrl: './transport-footer.component.html',
  styleUrls: ['./transport-footer.component.scss'],
})
export class TransportFooterComponent  implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='New-findings'
  goToPage(tab:any){
  this.selectedTab=tab
   if(tab=='Logistic'){
    this.router.navigate(['/transport-department/transport-management'])
  }

  // else if(tab=='Report'){
  //   this.router.navigate(['/digital//report-management'])
  // }
  else if(tab=='User'){
    this.router.navigate(['/transport-department/user-management'])
  }
  
  }
}
