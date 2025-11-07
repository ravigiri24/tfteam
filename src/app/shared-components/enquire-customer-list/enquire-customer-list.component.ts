import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-enquire-customer-list',
  templateUrl: './enquire-customer-list.component.html',
  styleUrls: ['./enquire-customer-list.component.scss'],
})
export class EnquireCustomerListComponent  implements OnInit {

  @Input() search: any={mobileNo:null};
  @Input() searchKey: any='mobileNo';
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

  

showMore(index: number, keyValue: any) {
  this.showMoreDetails[index] = !this.showMoreDetails[index];
  // You can add animation logic here if needed
}
  actionEvent(customer: any, button: any,index:any) {
    this.actionEventCall.emit({ customer, button,index });
  }
 

}
