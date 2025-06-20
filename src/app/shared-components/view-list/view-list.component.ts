import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent  implements OnInit {
@Input() search:any
@Input() searchKey:any
@Input() list:any=[]
@Input() keyList:any=[]
@Input() buttonArray:any=[]
@Output() actionEventCall=new EventEmitter()
  constructor() { }

  ngOnInit() {}
actionEvent(tractor:any,button:any){
  this.actionEventCall.emit({tractor,button})
}
}
