import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
})
export class ViewListComponent implements OnInit {
  @Input() search: any
  @Input() searchKey: any
  @Input() showSearch: any = true
  @Input() width: any = 60
  @Input() list: any = []
  @Input() keyList: any = []
  @Input() buttonArray: any = []
  @Input() listColorClass: any;
  @Output() actionEventCall = new EventEmitter();
  photoCount = 2;
  showOverlay = false;
  activeCardIndex: number | null = null;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log("ViewListComponent", this.list, this.search, this.searchKey);
  }
  triggerOverlayAnimation(index: number) {
    this.activeCardIndex = null;
    this.activeCardIndex = index;
    setTimeout(() => {
      this.showOverlay = true;
    }, 500);
    // this.photoCount++;
  }

  onOverlayAnimationEnd() {
    setTimeout(() => {
      this.activeCardIndex = null;
    }, 800);
    this.showOverlay = false;
  }

  actionEvent(tractor: any, button: any) {
    this.actionEventCall.emit({ tractor, button })
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
}
