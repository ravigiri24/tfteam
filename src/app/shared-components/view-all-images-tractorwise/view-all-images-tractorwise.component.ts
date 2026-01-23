import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ImageSliderComponent } from 'src/app/shared-components/image-slider/image-slider.component';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-view-all-images-tractorwise',
  templateUrl: './view-all-images-tractorwise.component.html',
  styleUrls: ['./view-all-images-tractorwise.component.scss'],
})
export class ViewAllImagesTractorwiseComponent  implements OnInit {
  tractor: any
  constructor(private modalControl: ModalController,private share:ShareService,private api:ApiService) { }
  @Input() jobDetails: any
  @Input() imageArray: any
  @Input() beforeService: any = []
  @Input() afterService: any = []
  @Input() jobArray: any = []
  @Input() isJobDone: any = false
  @Input() listColorClass = 'secondColor';
  @Output() reloadImage = new EventEmitter()
  ngOnInit() {
this.getAllImage()
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  allImages:any=[]
  purchaseTimeList:any=[]
  liveImages:any=[]
  getAllImage() {
    let obj: any = {};
    obj.operate = this.share.getStaffObj()?.operate;
obj.tractor_id=this.tractor?.id
let repairMappedData:any=[]
this.tractor?.repairMappedData?.forEach((f:any)=>{
  repairMappedData.push(f?.id)
})
obj.repairMappedData=repairMappedData
   
this.share.showLoading("Getting Image")
    this.api.postapi('getAllImageTractorWise', obj).subscribe(
      (res: any) => {
this.allImages=res?.data
this.beforeService=this.allImages?.repair_image?.filter((f:any)=>f.imageGroup=='AFTER_SERVICE')
this.afterService=this.allImages?.repair_image?.filter((f:any)=>f.imageGroup=='BEFORE_SERVICE')
this.purchaseTimeList=this.allImages?.rawImages?.filter((f:any)=>f.imageGroup=='BEFORE_SERVICE')
this.liveImages=this.allImages?.live_images
        this.share.spinner.dismiss()
      },
      (error: any) => {
        this.share.spinner.dismiss()
      }
    );
  }

  async viewImage(imageGroup: any) {
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
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
      componentProps: {

        image: image,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.reloadImage.emit()
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
      this.reloadImage.emit()
    }
  }

}
