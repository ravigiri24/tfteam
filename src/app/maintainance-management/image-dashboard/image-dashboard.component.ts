import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'app-image-dashboard',
  templateUrl: './image-dashboard.component.html',
  styleUrls: ['./image-dashboard.component.scss'],
})
export class ImageDashboardComponent  implements OnInit {
  tarctor_id:any
  constructor(private modalControl:ModalController) { }

  ngOnInit() {}
  dismiss() {
    this.modalControl.dismiss();
  }
  async viewImage(imageGroup:any){
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
     
        tarctor_id: this.tarctor_id,
        imageGroup:imageGroup
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
}
