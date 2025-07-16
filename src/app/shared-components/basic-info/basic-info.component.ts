import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent  implements OnInit {
@Input() form:FormGroup
@Input() yearArray:any=[]
@Input() data:any
@Input() isStockEntry:any=false
@Output() saveFormEvent=new EventEmitter()
  constructor() { }

  ngOnInit() {

    console.log("form",this.form);
    
  //  this.createYearArray()
  }
  saveForm(){
    this.saveFormEvent.emit()
  }

}
