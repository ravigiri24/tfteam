import { Component, OnInit,Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent  implements OnInit {
@Input() form:FormGroup
  constructor() { }

  ngOnInit() {
    this.createYearArray()
  }
  yearArray:any = [];
  createYearArray() {
    let date = new Date();
    let getyear = date.getFullYear();
    let tillyear = Number(getyear) - 21;
    for (let index = getyear; index > tillyear; index--) {
      this.yearArray.push(index);
    }
  }
}
