import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { ShareService } from 'src/app/share.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
  animations: [
    trigger('showMoreDetails', [
      state('false', style({ maxHeight: 0 })),
      state('true', style({ maxHeight: '500px' })),
      transition('false => true', animate('500ms ease-in-out')),
      transition('true => false', animate('500ms ease-in-out')),
    ]),
  ],
})
export class ViewListComponent implements OnInit {
  @Input() search: any;
  @Input() searchKey: any;
  @Input() showSearch: any = true;
  @Input() width: any = 60;
  @Input() list: any = [];
  @Input() keyList: any = [];
  @Input() rowLineCount = 3;
  @Input() buttonArray: any = [];
  @Input() listColorClass: any;
  @Output() actionEventCall = new EventEmitter();
  photoCount = 2;
  showOverlay = false;
  showMoreDetails: { [index: number]: any }
  activeCardIndex: number | null = null;
  constructor(private modalCtrl: ModalController, private share: ShareService) { }

  ngOnInit() {
    console.log('ViewListComponent', this.list, this.search, this.searchKey);
    this.list?.forEach((tractor: any) => {
      this.share.getImagesToShow(tractor)
    })

  }
  triggerOverlayAnimation(index: number, tractor: any) {
    this.getImageOFTractor(tractor);
    this.activeCardIndex = null;
    this.activeCardIndex = index;
    setTimeout(() => {
      this.showOverlay = true;
    }, 100);
    // this.photoCount++;
  }

  onOverlayAnimationEnd() {
    setTimeout(() => {
      this.activeCardIndex = null;
    }, 800);
    this.showOverlay = false;
  }
  getImageOFTractor(tractor: any) {
    let imagesToShow = tractor?.rawImages?.filter(
      (img: any) =>
        img?.imageGroup == 'BEFORE_SERVICE' ||
        img?.imageGroup == 'AFTER_SERVICE'
    );
    tractor.imagesToShow = imagesToShow;
  }


  showMore(index: number, keyValue: any) {
    this.showMoreDetails[index] = !this.showMoreDetails[index];
    // You can add animation logic here if needed
  }
  actionEvent(tractor: any, button: any) {
    setTimeout(() => {
      this.actionEventCall.emit({ tractor, button });
    }, 600);
  }
  async viewImage(image: any) {
    const modal = await this.modalCtrl.create({
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
  async viewInSlider(image: any, imageArray: any) {
    const modal = await this.modalCtrl.create({
      component: ImageSliderComponent,
      cssClass: 'midium-model',
      componentProps: {

        image: image,
        imageArray: imageArray
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {

    }
  }
  searchText: any = ''
}
