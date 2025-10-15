import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  constructor(private modalCtrl: ModalController,private inAppBrowser: InAppBrowser) {}
  imageArray: any = [];
  image: any;
  @Input() listColorClass = 'sixColor';
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

 
}
