import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-single-image-show',
  templateUrl: './single-image-show.component.html',
  styleUrls: ['./single-image-show.component.scss'],
})
export class SingleImageShowComponent implements OnInit {
  image: any;
  showDeleteButton: any = false;
  constructor(
    private modalControl: ModalController,
    private alertCtrl: AlertController,
    private share: ShareService,
    private api:ApiService,
     private inAppBrowser: InAppBrowser
  ) {}

  ngOnInit() {

    
  }
    openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    
    browser.show();
  }
  downloadItem(){

  }
  dismiss() {
    this.modalControl.dismiss();
  }
  delete() {
    this.showDeleteButton = true;
  }
  async deleteItem() {
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
      this.deleteConfirm();
    }
  }

  deleteConfirm() {
    let obj = {
      src: 'raw_image',
      data: { isDeleted: true },
      id: this.image?.id,
    };

    this.share.showLoading('Deleting Image...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
        this.modalControl.dismiss({isDeleted:true});
    });
  }
}
