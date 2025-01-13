import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tractor-sells-details',
  templateUrl: './tractor-sells-details.component.html',
  styleUrls: ['./tractor-sells-details.component.scss'],
})
export class TractorSellsDetailsComponent  implements OnInit {

  constructor(private modalControl:ModalController) { }

  dismiss() {
    this.modalControl.dismiss();
  }
  ngOnInit() {}

}
