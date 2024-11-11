import { Component } from '@angular/core';
import { ShareService } from './share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private share:ShareService,private router:Router) {
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
   
  }
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
