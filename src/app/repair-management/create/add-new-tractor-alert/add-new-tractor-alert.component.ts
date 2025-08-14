import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-tractor-alert',
  templateUrl: './add-new-tractor-alert.component.html',
  styleUrls: ['./add-new-tractor-alert.component.scss'],
})
export class AddNewTractorAlertComponent  implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}
grantPermission(){
this.modalCtrl.dismiss(true)
}
cancelAllotTF(){
this.modalCtrl.dismiss(false)
}
}
