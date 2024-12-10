import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.scss'],
})
export class SelectBrandComponent  implements OnInit {
@Input() modelList:any=[]
@Input() selectedModel:any
@Output() setModelDetail=new EventEmitter()
  constructor() { }

  ngOnInit() {
  
  }
  search:any

  selectModel(model:any){
this.selectedModel=model
this.setModelDetail.emit(model)
  }
}
