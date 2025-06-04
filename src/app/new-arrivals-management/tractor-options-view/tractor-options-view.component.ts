import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { ForwardToTransportComponent } from '../forward-to-transport/forward-to-transport.component';
import { UploadScreenShotComponent } from '../upload-screen-shot/upload-screen-shot.component';
import { TractorShowAllDataComponent } from 'src/app/shared-components/tractor-show-all-data/tractor-show-all-data.component';
import { StartTransportDialogComponent } from 'src/app/transport-management/start-transport-dialog/start-transport-dialog.component';
@Component({
  selector: 'app-tractor-options-view',
  templateUrl: './tractor-options-view.component.html',
  styleUrls: ['./tractor-options-view.component.scss'],
})
export class TractorOptionsViewComponent implements OnInit {
  constructor(
    private modalControl: ModalController,
    private alertCtrl: AlertController,
    private share: ShareService,
    private api:ApiService
  ) {}
  tractor: any;
  ngOnInit() {}
  dismiss() {
    this.modalControl.dismiss();
  }
  async deleteItem() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Tractor',
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
      this.removeTractor();
    }
  }
  removeTractor() {
    let objData: any = {
      isDeleted: true,
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractor?.id,
    };

    this.share.showLoading('Deleting Tractor...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Removed Successfully...');
     this.modalControl.dismiss({isDeleted:true});
      //  this.dismiss();
    });
  }
  async tractorShowAllData(){
    const modal = await this.modalControl.create({
        component: TractorShowAllDataComponent,
        componentProps: {
          tractor: this.tractor,
      
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
  }
    async startTranspotation() {
        const modal = await this.modalControl.create({
        component: ForwardToTransportComponent,
        componentProps: {
          tractor: this.tractor,
      
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
      
//   if(data?.isForworded){
//  this.modalControl.dismiss({isForworded:true});
//   }
  if(data?.isForworded){
 this.share.showLoading('clossing...');
  }
setTimeout(() => {
  this.share.spinner.dismiss()
  if(data?.isForworded){
    this.modalControl.dismiss({isForworded:true})
  }
}, 1000);

    }
      async goToUplodeSection(){
    
      let tarctor_id=this.tractor?.id
            const modal = await this.modalControl.create({
              component: UploadScreenShotComponent,
              componentProps: {
                tarctor_id: tarctor_id,
              },
            });
            await modal.present();
           
        
            const { data, role } = await modal.onWillDismiss();
          
      }
}
