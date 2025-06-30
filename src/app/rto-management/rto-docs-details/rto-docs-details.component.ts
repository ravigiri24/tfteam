import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';
@Component({
  selector: 'app-rto-docs-details',
  templateUrl: './rto-docs-details.component.html',
  styleUrls: ['./rto-docs-details.component.scss'],
})
export class RtoDocsDetailsComponent  implements OnInit {

  constructor(private modalCtrl:ModalController) { }
tractor:any
  ngOnInit() {}
    dismiss() {
    this.modalCtrl.dismiss();
  }
async seeSellDetails(){

            const modal = await this.modalCtrl.create({
              component: ShowSalesDetailsComponent,
              componentProps: {
                tractor: this.tractor,
              },
            });
            await modal.present();
            const { data, role } = await modal.onWillDismiss();
            console.log('role', role);
  
          
}
  async goToUplodeSection(imageGroup: any) {
    let showHeading = null;
    if (imageGroup == 'SALE_DEAD') {
      showHeading = 'View Sale Dead';
    } 
  else if(imageGroup =='ADHAR_CARD'){
      showHeading = ' View Adhar Card';
  }
    else if(imageGroup =='PAN_CARD'){
      showHeading = ' View Pan Card';
  }
      else if(imageGroup =='BAHI_KHATA'){
      showHeading = ' View Bahi kHATA';
  }
      else if(imageGroup =='FORM_34'){
      showHeading = ' View Form 34';
  }
    else if (imageGroup == 'FINANCE_DOCUMENTS') {
      showHeading = 'View Finance Documents';
    } 
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: imageGroup,
        showDeleteButton: false,
        showHeading: showHeading,
        uploadPhoto:false,
       
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
async seeFinanceDetails(){
const modal = await this.modalCtrl.create({
              component: FinanceDetailsComponent,
              componentProps: {
                tractor: this.tractor,
              },
            });
            await modal.present();
            const { data, role } = await modal.onWillDismiss();
            console.log('role', role);
  
          
}
}
