/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ImageSliderComponent } from 'src/app/shared-components/image-slider/image-slider.component';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-receive-tractor-image',
  templateUrl: './receive-tractor-image.component.html',
  styleUrls: ['./receive-tractor-image.component.scss'],
})
export class ReceiveTractorImageComponent  implements OnInit {

  tarctor_id: any
  constructor(private modalControl: ModalController,private share:ShareService,private api:ApiService) { }
listColorClass='firstColor'
  ngOnInit() {
this.getRawImages()
  }
  staffDetails:any
    getRawImages(){
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj = {
      operate: this.staffDetails?.staffCode,
      
      tractor_id: this.tractor?.id,
    };
    this.share.showLoading('Fetching Data...');
    this.api.postapi("getRawImages", obj).subscribe((res: any) => {
      console.log("data",res);
      this.receivedTractorImages=res?.data || []
      this.receivedTractorImages= this.receivedTractorImages.filter((f:any)=>f.imageGroup=='RECEIVED_TRACTOR')
      this.share.spinner.dismiss();
 
    });
  }

receivedTractorImages:any=[]
tractor:any
  async viewImage(imageGroup: any) {
     const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: imageGroup,
        showDeleteButton: true,
        showHeading: "Upload Image",
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {

    }
    this.getRawImages()

  }
  dismiss(){
    this.modalControl.dismiss()
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
   
    }
  }
    async viewInSlider(image: any,imageArray:any) {
    const modal = await this.modalControl.create({
      component: ImageSliderComponent,
      componentProps: {
 
        image: image,
        imageArray:imageArray
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {

    }
  }
}
