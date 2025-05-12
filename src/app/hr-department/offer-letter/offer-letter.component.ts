import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddOfferLetterComponent } from './add-offer-letter/add-offer-letter.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-offer-letter',
  templateUrl: './offer-letter.component.html',
  styleUrls: ['./offer-letter.component.scss'],
})
export class OfferLetterComponent  implements OnInit {

  constructor(private modalCtrl:ModalController,private share:ShareService,private api:ApiService,private inAppBrowser:InAppBrowser,private alertCtrl:AlertController) { }
  ionViewWillEnter() {
  
    this.getOffers();
  }
  ngOnInit() {}
   async addOffer(offer: any=null) {
      const modal = await this.modalCtrl.create({
        component: AddOfferLetterComponent,
        componentProps: {
          editData: offer,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
     if(data){
      this.getOffers()
     }
     // this.getTractorList();
    }
    search={
      candidateName:null
    }
    editOffer(offer:any){
this.addOffer(offer)
    }
    download(offer:any){
     this.openPDF(offer?.imageUrlUrl) 
    }
    openPDF(dataUrl: string) {
      const browser = this.inAppBrowser.create(dataUrl, '_blank');
   
      browser.show();
    }
      async deleteItem(offer: any,text:any='Delete Offer ?') {
    const alert = await this.alertCtrl.create({
      header: text,
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
      this.deleteOffer(offer);
    }
  }
    deleteOffer(offer:any){

    let objData: any = {
      isDeleted:true,
    };
    let obj = {
      src: 'offer_letters',
      data: objData,
      id: offer?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
      this.getOffers()
 
    //  this.dismiss();
    });

    }
    staffDetails:any
    offerList:any=[]
      getOffers(loadingMsg: any = 'Loading...') {
        let staffDetails: any = this.share.get_staff();
        this.staffDetails = JSON.parse(staffDetails);
    
        let obj = {
          operate: this.staffDetails?.staffCode,
     
        };
        this.share.showLoading(loadingMsg);
        this.api.postapi('getOfferLetters', obj).subscribe(
          (res: any) => {
            this.offerList = res?.data;
            // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
       
            this.share.spinner.dismiss();
          
          },
          (error: any) => {}
        );
      }

}
