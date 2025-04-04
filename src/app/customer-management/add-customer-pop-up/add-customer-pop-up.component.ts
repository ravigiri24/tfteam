import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-customer-pop-up',
  templateUrl: './add-customer-pop-up.component.html',
  styleUrls: ['./add-customer-pop-up.component.scss'],
})
export class AddCustomerPopUpComponent implements OnInit {
  editData: any;
  staffList: any;
  showAddComp: any;
  constructor(private modalCtrl: ModalController) {


  }

  ngOnInit() {

    
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  updateList(e: any) {
    this.modalCtrl.dismiss(e);
  }
}
