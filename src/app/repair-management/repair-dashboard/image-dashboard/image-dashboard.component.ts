/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { ImageSliderComponent } from 'src/app/shared-components/image-slider/image-slider.component';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
@Component({
  selector: 'app-image-dashboard',
  templateUrl: './image-dashboard.component.html',
  styleUrls: ['./image-dashboard.component.scss'],
})
export class ImageDashboardComponent implements OnInit {
  tarctor_id: any
  constructor(private modalControl: ModalController) { }
  @Input() jobDetails: any
  @Input() imageArray: any
  @Input() beforeService: any = []
  @Input() afterService: any = []
  @Input() jobArray: any = []
  @Input() isJobDone: any = false
  @Input() listColorClass = 'secondColor';
  @Output() reloadImage = new EventEmitter()
  ngOnInit() {

  }
  dismiss() {
    this.modalControl.dismiss();
  }


  async viewImage(imageGroup: any) {
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      cssClass: 'modal-xl',
      componentProps: {

        jobId: this.jobDetails?.id,
        imageGroup: imageGroup
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {

    }
    this.reloadImage.emit()
  }
  async viewImageSingle(image: any) {
    const modal = await this.modalControl.create({
      component: SingleImageShowComponent,
      cssClass: 'modal-image-viewer',
      componentProps: {
        showDeleteButton: true,
        image: image,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (data?.isDeleted && data?.deletedId) {
      this.beforeService = this.beforeService?.filter((f: any) => f?.id != data.deletedId);
      this.jobArray = this.jobArray?.filter((f: any) => f?.id != data.deletedId);
      this.reloadImage.emit();
    }

    if (role === 'confirm') {
      this.reloadImage.emit()
    }
  }
    async viewInSlider(image: any,imageArray:any) {
    const modal = await this.modalControl.create({
      component: ImageSliderComponent,
      cssClass: 'light-modal modal-image-viewer',
      componentProps: {
        showDeleteButton: true,
        image: image,
        imageArray:imageArray
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (data?.isDeleted && data?.deletedId) {
      this.afterService = this.afterService?.filter((f: any) => f?.id != data.deletedId);
      this.reloadImage.emit();
    }

    if (role === 'confirm') {
      this.reloadImage.emit()
    }
  }
}
