import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-view-staff-list',
  templateUrl: './view-staff-list.component.html',
  styleUrls: ['./view-staff-list.component.scss'],
})
export class ViewStaffListComponent  implements OnInit {
  @Input() search: any;
  @Input() searchKey: any;
  @Input() showSearch: any = true;
  @Input() width: any = 60;
  @Input() list: any = [];
  @Input() keyList: any = [];
  @Input() rowLineCount= 3;
  @Input() buttonArray: any = [];
  @Input() listColorClass: any;
  @Output() actionEventCall = new EventEmitter();
  photoCount = 2;
  showOverlay = false;
  showMoreDetails: { [index: number]: any }
  activeCardIndex: number | null = null;
  constructor(private modalCtrl: ModalController, private share: ShareService) { }

  ngOnInit() {
    console.log('ViewListComponent', this.list, this.search, this.searchKey);
 

  }

  
searchText:any
showMore(index: number, keyValue: any) {
  this.showMoreDetails[index] = !this.showMoreDetails[index];
  // You can add animation logic here if needed
}
  actionEvent(staff: any, button: any,index:any) {
    this.actionEventCall.emit({ staff, button,index });
  }
 
}
