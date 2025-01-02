import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-admin',
  templateUrl: './footer-admin.component.html',
  styleUrls: ['./footer-admin.component.scss'],
})
export class FooterAdminComponent  implements OnInit {
  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='New-arrivals'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='New-arrivals'){
    this.router.navigate(['/admin-block/digital-analyse'])
  }
  else if(tab=='operational'){
    this.router.navigate(['/admin-block/operational-analyse'])
  }
  else if(tab=='Maintainance'){
    this.router.navigate(['/operational/maintainance-management'])
  }
  else if(tab=='Live'){
    this.router.navigate(['/operational/all-tractor-management'])
  }
  
  // else if(tab=='Report'){
  //   this.router.navigate(['/digital//report-management'])
  // }
  else if(tab=='User'){
    this.router.navigate(['/operational/user-management'])
  }
  
  }

}
