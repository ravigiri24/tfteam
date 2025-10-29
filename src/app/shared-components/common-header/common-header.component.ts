import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent  implements OnInit {
  @Input() listColorClass: any;
  @Input() title: any;
  @Input() selectedStore: any;
  @Input() isListFilter: any=false;
  @Input() warehouseList: any=[];
  @Input() brandList: any=[];
  @Input() list: any; //np
  @Output() actionEventHeader = new EventEmitter();
  @Input() headerDisplayArray: any=[]; //np
  // listBy = 'BUFFER';
  constructor() { }
actionEventHeaderCall(e:any){
this.actionEventHeader.emit(e)
}
  ngOnInit() {
    // this.listBy= 'BUFFER';
    console.log("listColorClass",this.listColorClass);
  }
  submenuOpen: boolean = false;
  openSubmenu(){
    this.submenuOpen = !this.submenuOpen;
  }
getAllTractorListStorewise(){

}
}
