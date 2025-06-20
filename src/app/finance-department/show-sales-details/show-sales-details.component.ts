import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-show-sales-details',
  templateUrl: './show-sales-details.component.html',
  styleUrls: ['./show-sales-details.component.scss'],
})
export class ShowSalesDetailsComponent  implements OnInit {


    constructor(private modalControl: ModalController,private share:ShareService,private api:ApiService) {}
tractor:any

  ngOnInit() {
    this.getDataByID()
  }
  sellingData:any
  getDataByID(){
    this.share.showLoading("Getting Data...")
    let obj = this.share.getDataId(null, false, [], this.tractor?.sellingDetailedId);
    this.api.postapi('getSellingDetailsByID', obj).subscribe(
      (res:any) => {
        this.sellingData = res?.data;
   
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
