import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent  implements OnInit {
@Input() form:FormGroup
@Input() yearArray:any=[]
  constructor() { }

  ngOnInit() {
  //  this.createYearArray()
  }


}