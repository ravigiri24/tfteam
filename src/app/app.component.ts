import { Component } from '@angular/core';
import { ShareService } from './share.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  currentUrl:any
  constructor(public share:ShareService,private router:Router,private activated:ActivatedRoute) {
    console.log("share",this.share.showFooter);
    
    this.share.checkLogin()
    document.documentElement.style.setProperty(
      `--app-theme-element-color`,
      '#dc3545'
    );
    document.documentElement.style.setProperty(
      `--app-theme-element-color-second`,
      '#6300a3'
    );
    document.documentElement.style.setProperty(
      `--app-theme-color-third`,
      ' #FFA500'
    );
    this.sreenWidth=  screen.width
    this.sreenHeight=  screen.height
     document.documentElement.style.setProperty(
      `--app-screen-width-global`,
      this.sreenWidth+'px'
    );
    document.documentElement.style.setProperty(
      `--app-screen-height-global`,
      this.sreenHeight+'px'
    );
    activated.url.subscribe((res)=>{
      console.log("res",res);
    this.currentUrl==res[0]?.path
    })
  }
  sreenWidth
  sreenHeight
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
