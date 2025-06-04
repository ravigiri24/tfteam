import { Component, OnInit } from '@angular/core';
import { TransportActualDateFormComponent } from '../transport-actual-date-form/transport-actual-date-form.component';
import { ModalController } from '@ionic/angular';
import { ConfirmDeliveryComponent } from '../confirm-delivery/confirm-delivery.component';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-transport-options',
  templateUrl: './transport-options.component.html',
  styleUrls: ['./transport-options.component.scss'],
})
export class TransportOptionsComponent implements OnInit {
  constructor(private modalControl: ModalController,private share:ShareService) {}
  tractor: any;
  dismiss() {
    this.modalControl.dismiss();
  }
  async actualDate() {
    const modal = await this.modalControl.create({
      component: TransportActualDateFormComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {
        tractorDetails: this.tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data?.isActioned) {
    }
  }
  async viewImage(imageGroup: any) {
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: imageGroup,
        showDeleteButton: true,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  ngOnInit() {}
  async arrivalDateActual() {
    const modal = await this.modalControl.create({
      component: TransportActualDateFormComponent,
      componentProps: {
        tractor: this.tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  }
  async goToUplodeSection(imageGroup: any) {
    let showHeading = null;
    if (imageGroup == 'RELEASE_LETTERS') {
      showHeading = 'UplOad Relase Letter';
    } else if (imageGroup == 'NOTARY_LETTERS') {
      showHeading = 'UplOad Notary Letter';
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
  async reachDestination() {
    const modal = await this.modalControl.create({
      component: ConfirmDeliveryComponent,
      componentProps: {
        tractorDetails: this.tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
 
  if(data?.isReached){
   this.share.showLoading('clossing...');
  }
setTimeout(() => {
  this.share.spinner.dismiss()
  if(data?.isReached){
    this.modalControl.dismiss({isReached:true})
  }
}, 1000);

  }
}
