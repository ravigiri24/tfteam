import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() yearArray: any = [];
  @Input() data: any;
  @Input() isStockEntry: any = false;
  @Output() saveFormEvent = new EventEmitter();
  constructor() {}

  ngOnInit() {
    console.log('form', this.form);

    //  this.createYearArray()
  }
  saveForm() {
    this.saveFormEvent.emit();
  }
  setBackDateEntry() {
    if (this.form.controls['isBackDateEntry'].value == true) {
      this.form.controls['backDate'].setValidators([Validators.required]);
      this.form.updateValueAndValidity();
    }else{
    this.form.controls['backDate'].clearValidators();
      this.form.updateValueAndValidity();
    }
    this.form.controls['backDate'].setValue(null);
  }
}
