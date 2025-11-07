import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-models',
  templateUrl: './view-models.component.html',
  styleUrls: ['./view-models.component.scss'],
})
export class ViewModelsComponent  implements OnInit {

  constructor(private modalCtrl:ModalController) { }
modelList:any=[]
  dismiss() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}

}
