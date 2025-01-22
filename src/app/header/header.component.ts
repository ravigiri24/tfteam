import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService) { }
 userDetails:any
  ngOnInit() {
console.log("ROUTER",this.router.url);

let user=this.share.get_staff()
if(user){
  this.userDetails=JSON.parse(user)
  }
}
  goToHome(){
    this.router.navigate(['/home'])
  }
  isAlertOpen = false;
  //alertButtons = ['Confirm'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }
}
