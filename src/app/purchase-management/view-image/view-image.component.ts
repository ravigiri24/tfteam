import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ImageSliderComponent } from 'src/app/shared-components/image-slider/image-slider.component';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit {
  tractor: any;
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
  ) {}
  @Input() jobDetails: any;
  @Input() imageArray: any;
  @Input() beforeService: any = [];
  @Input() afterService: any = [];
  @Input() jobArray: any = [];
  @Input() isJobDone: any = false;
  @Input() listColorClass = 'secondColor';
  @Output() reloadImage = new EventEmitter();
  ngOnInit() {
    this.getAllImage();
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  allImages: any = [];
  purchaseTimeList: any = [];
  liveImages: any = [];
  receiveTractorList: any = [];
  getAllImage() {
    let obj: any = {};
    obj.operate = this.share.getStaffObj()?.operate;
    obj.tractor_id = this.tractor?.id;

    this.share.showLoading('Getting Image');
    this.api.postapi('getNewFindingImages', obj).subscribe(
      (res: any) => {
        this.allImages = res?.data?.filter((f: any) => f.isDeleted == '0');
        this.tractorImages = this.allImages?.filter(
          (f: any) => f.imageGroup == 'NEW_FINDING',
        );
        this.kycDocs = this.allImages?.filter(
          (f: any) => f.imageGroup == 'KYC_PAPER',
        );
        this.nocDocs = this.allImages?.filter(
          (f: any) => f.imageGroup == 'NOC_PAPER',
        );
        this.otherDocs = this.allImages?.filter(
          (f: any) => f.imageGroup == 'OTHER_DOCUMENTS',
        );

        this.share.spinner.dismiss();
      },
      (error: any) => {
        this.share.spinner.dismiss();
      },
    );
  }
  tractorImages: any = [];
  kycDocs: any = [];
  nocDocs: any = [];
  otherDocs: any = [];
  async viewImage(imageGroup: any) {
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: imageGroup,
        uploadPhoto: true,
        apiName: 'saveNewFindingImage',
        getApiName: 'getNewFindingImages',
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    this.getAllImage();

    if (role === 'confirm') {
    }
  }

  async viewImageSingle(image: any) {
    const modal = await this.modalControl.create({
      component: SingleImageShowComponent,
      componentProps: {
        image: image,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.reloadImage.emit();
    }
  }
  async viewInSlider(image: any, imageArray: any) {
    const modal = await this.modalControl.create({
      component: ImageSliderComponent,
      cssClass: 'light-modal',
      componentProps: {
        showDeleteButton: true,
        image: image,
        imageArray: imageArray,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.reloadImage.emit();
    }
    this.getAllImage();
  }
}
