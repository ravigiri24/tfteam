import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
@Component({
  selector: 'app-noc-view-options',
  templateUrl: './noc-view-options.component.html',
  styleUrls: ['./noc-view-options.component.scss'],
})
export class NocViewOptionsComponent  implements OnInit {

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
      async salesDetails(){
              const modal = await this.modalControl.create({
                component: ShowSalesDetailsComponent,
                componentProps: {
                  tractor: this.tractor,
                },
              });
              await modal.present();
              const { data, role } = await modal.onWillDismiss();
              console.log('role', role);
    
            }
}
