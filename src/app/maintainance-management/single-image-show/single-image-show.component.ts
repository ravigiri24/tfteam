import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-single-image-show',
  templateUrl: './single-image-show.component.html',
  styleUrls: ['./single-image-show.component.scss'],
})
export class SingleImageShowComponent  implements OnInit {
  image:any
  constructor(private modalControl:ModalController) { }

  ngOnInit() {}
  dismiss() {
    this.modalControl.dismiss();
  }
}
