import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent  implements OnInit {
  @Input() listColorClass: any;
  @Input() listBy: any;
  @Input() buffertractorList: any; //np
  // listBy = 'BUFFER';
  constructor() { }

  ngOnInit() {
    // this.listBy= 'BUFFER';
    console.log("listColorClass",this.listColorClass);
  }
  submenuOpen: boolean = false;
  openSubmenu(){
    this.submenuOpen = !this.submenuOpen;
  }

}
