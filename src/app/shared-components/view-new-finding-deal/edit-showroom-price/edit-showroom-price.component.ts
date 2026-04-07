import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-edit-showroom-price',
  templateUrl: './edit-showroom-price.component.html',
  styleUrls: ['./edit-showroom-price.component.scss'],
})
export class EditShowroomPriceComponent  implements OnInit {

  showFilter = true;
  currentPrice: any;
  @Input() listColorClass: any = "firstColor";
  constructor(private modalcontrol: ModalController, private share: ShareService, private api: ApiService) { }
  isNoc: any = true
  ngOnInit() {
    this.currentPrice = Number(this.currentPrice)

  }
  tractor: any

  updatePrice() {
    if (this.currentPrice != null && this.currentPrice != undefined && this.currentPrice >0) {
      let objData: any = {
        currentPrice: this.currentPrice
      };
       this.modalcontrol.dismiss(objData)
    }
    else {
      this.share.presentToast('Please Fill Valid Value');
    }
  }
}
