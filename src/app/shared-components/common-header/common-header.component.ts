import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit {
  @Input() listColorClass: any;
  @Input() title: any;
  @Input() selectedStore: any;
  @Input() selectedItem: any;
  @Input() isListFilter: any = false;
  @Input() showDateFilter: any = false;
  @Input() date: any;
  @Input() universalSelect: any = false;
  @Input() showWareHouse: any = false;
  @Input() warehouseList: any = [];
  @Input() showFilterList: any = false;
  @Input() allFilterList: any = [];
  @Input() brandList: any = [];
  @Input() optionsArray: any = [];
  @Input() list: any; //np
  @Output() actionEventHeader = new EventEmitter();
  @Output() optionActionEvent = new EventEmitter();
  @Output() selectWareHouseAction = new EventEmitter();
  @Output() expandListEvent = new EventEmitter();
  @Output() changeDateEvent = new EventEmitter();
  @Input() headerDisplayArray: any = []; //np
  mobiledateOpen: boolean = false;
  // listBy = 'BUFFER';
  constructor(public api: ApiService) { }
  actionEventHeaderCall(e: any,opI:any) {

    this.actionEventHeader.emit(e);
    if(opI>1){
    this.submenuOpen = !this.submenuOpen;
    }
    this.mobiledateOpen = false;

  }
  openDatePicker() {
    this.mobiledateOpen = !this.mobiledateOpen;
  }
  changeDateEventCall() {
    this.mobiledateOpen = !this.mobiledateOpen;
    this.changeDateEvent.emit(this.date)
  }
  expandListEventCall() {
    this.expandListEvent.emit()
  }
  optionActionEventCall() {
    this.optionActionEvent.emit(this.selectedItem)
  }
  ngOnInit() {
    // this.listBy= 'BUFFER';
    console.log("listColorClass", this.optionsArray);
  }
  submenuOpen: boolean = false;
  openSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
  getAllTractorListStorewise() {
    this.selectWareHouseAction.emit({ selectedStore: this.selectedStore })
  }
}
