import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-docs-options',
  templateUrl: './docs-options.component.html',
  styleUrls: ['./docs-options.component.scss'],
})
export class DocsOptionsComponent  implements OnInit {



    constructor(private modalControl: ModalController,private share:ShareService) {}
tractor:any
  ngOnInit() {}
   dismiss() {
    this.modalControl.dismiss();
  }
  async goToUplodeSection(imageGroup: any) {
    let showHeading = null;
    if (imageGroup == 'DOCUMENT_RTO') {
      showHeading = 'Upload Document';
    } 
        if (imageGroup == 'INSURANCE_RTO') {
      showHeading = 'Insurance Document';
    } 
        if (imageGroup == 'RC_OLD_RTO') {
      showHeading = 'Old RC';
    } 
        if (imageGroup == 'RC_NEW_RTO') {
      showHeading = 'New RC';
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
