import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-finance-options',
  templateUrl: './finance-options.component.html',
  styleUrls: ['./finance-options.component.scss'],
})
export class FinanceOptionsComponent  implements OnInit {

    constructor(private modalControl: ModalController,private share:ShareService) {}
tractor:any
  ngOnInit() {}
   dismiss() {
    this.modalControl.dismiss();
  }
  async goToUplodeSection(imageGroup: any) {
    let showHeading = null;
    if (imageGroup == 'FINANCE_DOCUMENTS') {
      showHeading = 'Upload Finance Documents';
    } 
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: imageGroup,
        showDeleteButton: true,
        showHeading: showHeading,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
}
