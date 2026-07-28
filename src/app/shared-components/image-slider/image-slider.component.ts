import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  constructor(private modalCtrl: ModalController,private inAppBrowser: InAppBrowser,private alertCtrl:AlertController,private share:ShareService,private api:ApiService) {}
  imageArray: any = [];
  image: any;
  showDeleteButton: any = false;
  @Input() listColorClass = 'sixColor';
  @ViewChild('swiperRef') swiperRef: ElementRef<any>;
  slidePrev() {
    this.swiperRef?.nativeElement?.swiper?.slidePrev();
  }
  slideNext() {
    this.swiperRef?.nativeElement?.swiper?.slideNext();
  }
  ngOnInit() {
    let findselectedImage = this.imageArray.findIndex(
      (f: any) => f.imageUrlUrl == this.image?.imageUrlUrl
    );
    if (findselectedImage > -1) {
      this.imageArray.splice(findselectedImage, 1);
      this.imageArray.unshift(this.image);
    }
  }
  // async shareImage(image:any) {
  //   await Share.share({
  //     title: 'Check out this image!',
  //     text: 'Here’s a great photo.',
  //     url: image, 
  //     dialogTitle: 'Share via'
  //   });
  // }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    
    browser.show();
  }
  async deleteItem(img:any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete this image?',
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.deleteConfirm(img);
    }
  }

  deleteConfirm(img:any) {
    let obj = {
      src: 'new_findings_image',
      data: { isDeleted: true },
      id: img?.id,
    };
console.log("obj",obj);

    this.share.showLoading('Deleting Image...');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.share.spinner.dismiss();
        this.imageArray = this.imageArray.filter((f: any) => f?.id != img.id);
        this.share.presentToast('Deleted Successfully...');
        this.modalCtrl.dismiss({ isDeleted: true, deletedId: img?.id });
      },
      (error: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Failed to delete image, please try again.');
      },
    );
  }
 
}
