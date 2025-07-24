import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-by-page',
  templateUrl: './filter-by-page.component.html',
  styleUrls: ['./filter-by-page.component.scss'],
})
export class FilterByPageComponent  implements OnInit {
 filterBy='ALL'
 listBy='BUFFER'
  constructor(private modalcontrol:ModalController) { }

  ngOnInit() {}
selectFilter(){
  this.modalcontrol.dismiss({filterBy:this.filterBy,isFilterChange:true,listBy:this.listBy})
}


}
