import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.scss'],
})
export class SelectBrandComponent  implements OnInit {
@Input() modelList:any=[]
  constructor() { }

  ngOnInit() {}

}
