import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-list-type',
  templateUrl: './select-list-type.component.html',
  styleUrls: ['./select-list-type.component.scss'],
})
export class SelectListTypeComponent  implements OnInit {
 filterBy='ALL'
 listBy='ALL'
  constructor(private modalcontrol:ModalController) { }

  ngOnInit() {}
selectFilter(){
  this.modalcontrol.dismiss({filterBy:this.filterBy,isFilterChange:true})
}
selectList(){
  this.modalcontrol.dismiss({listBy:this.listBy,isListChange:true})
}
}
