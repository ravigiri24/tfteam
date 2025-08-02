import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor(private router:Router,public share:ShareService) { }

  ngOnInit() {
    console.log("sha",this.share?.showFooter);
    
  }
    activeTabsColor = "firstColor";
selectedTab:any='Customer'
goToPage(tab:any){
this.selectedTab=tab
if(tab=='Customer'){
        this.activeTabsColor = "firstColor";
  this.router.navigate(['/digital/customer-management'])
}
else if(tab=='Follow-Up'){
     this.activeTabsColor = "secondColor";
  this.router.navigate(['/digital/follow-up-management'])
}
else if(tab=='Report'){
  
  this.router.navigate(['/digital/report-management'])
}
else if(tab=='User'){
      this.activeTabsColor = "thirdColor";
  this.router.navigate(['/digital/user-management'])
}
else if(tab=='Visitng'){
      this.activeTabsColor = "sixColor";
  this.router.navigate(['/digital/visiting-management'])
}

}
}
