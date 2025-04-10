import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-operation',
  templateUrl: './footer-operation.component.html',
  styleUrls: ['./footer-operation.component.scss'],
})
export class FooterOperationComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
  selectedTab:any='New-arrivals'
  goToPage(tab:any){
  this.selectedTab=tab
  if(tab=='New-arrivals'){
    this.router.navigate(['/operational/new-arrivals'])
  }
  else if(tab=='Logistic'){
    this.router.navigate(['/operational/transport-management'])
  }
  else if(tab=='BUFFER'){
    this.router.navigate(['/operational/buffer-stock'])
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
