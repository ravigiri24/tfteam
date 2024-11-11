import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}
selectedTab:any='Customer'
goToPage(tab:any){
this.selectedTab=tab
if(tab=='Customer'){
  this.router.navigate(['/customer-management'])
}
else if(tab=='Follow-Up'){
  this.router.navigate(['/follow-up-management'])
}
else if(tab=='Report'){
  this.router.navigate(['/report-management'])
}
else if(tab=='User'){
  this.router.navigate(['/user-management'])
}

}
}
