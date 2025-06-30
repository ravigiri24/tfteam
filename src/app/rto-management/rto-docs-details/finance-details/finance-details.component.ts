import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.scss'],
})
export class FinanceDetailsComponent  implements OnInit {


    constructor(private modalControl: ModalController,private share:ShareService,private api:ApiService) {}
tractor:any

  ngOnInit() {
    this.getDataByID()
  }
  financeData:any
  getDataByID(){
    this.share.showLoading("Getting Data...")
    let obj = this.share.getDataId(null, false, [], this.tractor?.financeDetailedId);
    this.api.postapi('getFinanceetailsByID', obj).subscribe(
      (res:any) => {
        this.financeData = res?.data;
   console.log("financeData",this.financeData);
   
        this.share.spinner.dismiss()
      },
      (error:any) => {
        this.share.spinner.dismiss()
      }
    );
  }
  dismiss(){
    this.modalControl.dismiss()
  }

}
