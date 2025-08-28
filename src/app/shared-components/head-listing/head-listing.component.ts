import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-head-listing',
  templateUrl: './head-listing.component.html',
  styleUrls: ['./head-listing.component.scss'],
})
export class HeadListingComponent  implements OnInit {
  @Input() search: any;
  @Input() searchKey: any;
  @Input() showSearch: any = true;
  @Input() width: any = 60;
  @Input() list: any = [];

  @Input() buttonArray: any = [];
  @Input() listColorClass: any;
  @Output() actionEventCall = new EventEmitter();
  photoCount = 2;
  showOverlay = false;
  showMoreDetails: { [index: number]: any }
  activeCardIndex: number | null = null;
  constructor(private modalCtrl: ModalController, private share: ShareService) { }

  ngOnInit() {
   

  }

  

  actionEvent(item: any, button: any,index:any=null) {
    this.actionEventCall.emit({ item, button ,index});
  }

}
