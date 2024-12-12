import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.scss'],
})
export class SelectBrandComponent  implements OnInit {
@Input() modelList:any=[]
@Input() selectedModel:any
@Input() modelForm:FormGroup
@Output() setModelDetail=new EventEmitter()
  constructor() { }

  ngOnInit() {
  
  }
  search:any
  ionViewWillEnter() {
    // let checkSelectedValue=this.modelForm.controls['modelID'].value
    // if(checkSelectedValue){
    // let find=  this.modelList.find((f:any)=>f.id==checkSelectedValue)
    // }
  }

  selectModel(model:any){
this.selectedModel=model
this.setModelDetail.emit(model)
  }
}
