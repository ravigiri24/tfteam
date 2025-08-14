import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-exist-tractor-alert',
  templateUrl: './exist-tractor-alert.component.html',
  styleUrls: ['./exist-tractor-alert.component.scss'],
})
export class ExistTractorAlertComponent  implements OnInit {
 constructor(private modalCtrl:ModalController) { }
listColorClass='fourthColor'
tractorList:any=[]
  search = {
    registractionNo: null,
  };
  ngOnInit() {}
grantPermission(){
this.modalCtrl.dismiss(true)
}
cancelAllotTF(){
this.modalCtrl.dismiss(false)
}
    keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
        { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Engine Number',getFromObj:true,objName:'purchasedetail', value: 'engineNumber', type: 'INPUT' },
    { key: 'Chassis Number', getFromObj:true,objName:'purchasedetail',value: 'chasisNumber', type: 'INPUT' },

    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },


    { key: 'Hours', value: 'hours', type: 'INPUT' },
   
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
}
