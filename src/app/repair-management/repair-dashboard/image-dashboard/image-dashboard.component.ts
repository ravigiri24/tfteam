import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
@Component({
  selector: 'app-image-dashboard',
  templateUrl: './image-dashboard.component.html',
  styleUrls: ['./image-dashboard.component.scss'],
})
export class ImageDashboardComponent  implements OnInit {
  tarctor_id:any
  constructor(private modalControl:ModalController) { }
@Input() jobDetails:any
@Input() imageArray:any
@Input() beforeService:any=[]
@Input() afterService:any=[]
@Input() jobArray:any=[]
@Output() reloadImage=new EventEmitter()
  ngOnInit() {
    
  }
  dismiss() {
    this.modalControl.dismiss();
  }


  async viewImage(imageGroup:any){
    const modal = await this.modalControl.create({
      component: ImageViewerComponent,
      componentProps: {
     
        jobId: this.jobDetails?.id,
        imageGroup:imageGroup
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
    this.reloadImage.emit()
  }
   async viewImageSingle(image:any){
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
}
