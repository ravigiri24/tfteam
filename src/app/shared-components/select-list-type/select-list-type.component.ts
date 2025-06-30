import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-list-type',
  templateUrl: './select-list-type.component.html',
  styleUrls: ['./select-list-type.component.scss'],
})
export class SelectListTypeComponent implements OnInit {
  filterBy = 'ALL';
  listBy = 'ALL';
  filterByTitle="Filter By"
  optionsArray= [
    { displayName: 'All', value: 'ALL' },
    { displayName: 'Mapped', value: 'MAPPED' },
    { displayName: 'Not Mapped', value: 'NOT_MAPPED' },
    { displayName: 'Not Sold', value: 'NOT_SOLD' },
    { displayName: 'Sold', value: 'SOLD' }
  ];
  showFilter = true;
  constructor(private modalcontrol: ModalController) {}

  ngOnInit() {
    console.log("optionsArray",this.optionsArray);
    
  }
  selectFilter() {
    this.modalcontrol.dismiss({
      filterBy: this.filterBy,
      isFilterChange: true,
    });
  }
  selectList() {
    this.modalcontrol.dismiss({ listBy: this.listBy, isListChange: true });
  }
}
