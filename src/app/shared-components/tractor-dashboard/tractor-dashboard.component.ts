import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeliveryComponent } from 'src/app/transport-management/confirm-delivery/confirm-delivery.component';
import { AddTransportStatusComponent } from 'src/app/transport-management/add-transport-status/add-transport-status.component';
import { StartRepairDialogComponent } from 'src/app/transport-management/start-repair-dialog/start-repair-dialog.component';
import { ImageDashboardComponent } from 'src/app/maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from 'src/app/maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { StartTransportDialogComponent } from 'src/app/transport-management/start-transport-dialog/start-transport-dialog.component';
import { TractorSellsDetailsComponent } from 'src/app/tractor-sells-details/tractor-sells-details.component';
import { TractorFinanceDetailsComponent } from 'src/app/tractor-finance-details/tractor-finance-details.component';
import { SellDocumentComponent } from 'src/app/sell-document/sell-document.component';
import { OtherExpenseListComponent } from 'src/app/tractor-dashboard/other-expense-list/other-expense-list.component';
import { PurchaseCarfComponent } from '../purchase-carf/purchase-carf.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UploadScreenShotComponent } from 'src/app/new-arrivals-management/upload-screen-shot/upload-screen-shot.component';
@Component({
  selector: 'app-tractor-dashboard',
  templateUrl: './tractor-dashboard.component.html',
  styleUrls: ['./tractor-dashboard.component.scss'],
})
export class TractorDashboardComponent  implements OnInit {
  
  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private route:Router,
    private activatedRoute:ActivatedRoute,
        private inAppBrowser: InAppBrowser,
        private alertCtrl:AlertController
  ) {}

  ngOnInit() {


  }
   async goToUplodeSection(){
      
        let tarctor_id=this.tractorDetails?.id
              const modal = await this.modalCtrl.create({
                component: UploadScreenShotComponent,
                componentProps: {
                  tarctor_id: tarctor_id,
                },
              });
              await modal.present();
             
          
              const { data, role } = await modal.onWillDismiss();
            
        }
    staffDetails:any
    cardHistory:any
  checkPruchaseCard(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractor_id,
    };
   
    this.api.postapi('getPurchaseCard', obj).subscribe(
      (res: any) => {
        this.cardHistory = res?.data;
    
    
     
      },
      (error: any) => {
        console.log("error",error);
        
      }
    );
  }
download(dataUrl:any){

    const browser = this.inAppBrowser.create(dataUrl, '_blank');
 
    browser.show();
  
}
  tractor_id:any
  srcPage:any
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.tractor_id = params?.id;
      this.srcPage = params?.srcPage;
    });
    this.checkPruchaseCard()
    this.getTractorDetails()
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  backToList(){
    this.route.navigate(['/operational/all-tractor-management'])
  }
  openEdit() {
    this.route.navigate(['/operational/edit-newarrivals', this.tractorDetails.rowCode,this.srcPage]);
  }
    async openPurchaseCard() {
      const modal = await this.modalCtrl.create({
        component: PurchaseCarfComponent,
        componentProps: {
          tractor: this.tractorDetails,
        },
      });
      await modal.present();
      //await modal.present();
  
      const { data, role } = await modal.onWillDismiss();
    }
    async startTranspotation() {
      const modal = await this.modalCtrl.create({
        component: StartTransportDialogComponent,
        componentProps: {
          tractorDetails: this.tractorDetails,
          updateTranctorStatus:false
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
     // if (role === 'confirm') {
        this.getTractorDetails('Refreshing Data...');
      //}
    }

  getTractorDetails(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractor_id,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorById', obj).subscribe(
      (res: any) => {
        this.tractorDetails = res?.data;
    
        this.share.spinner.dismiss();
     
      },
      (error: any) => {}
    );
  }
  addCost() {
    this.route.navigate(['/operational/add-cost', this.tractorDetails?.id]);
  }
  addStatusTransport() {
    this.showModal(this.tractorDetails?.id);
  }
    async showModal(tractor_id: any = null) {
      const modal = await this.modalCtrl.create({
        component: AddTransportStatusComponent,
        componentProps: {
          tractor_id: tractor_id,
        },
      });
      await modal.present();
      // const { data, role } = await modal.onWillDismiss();
      // console.log('role', role);
  
      // if (role === 'confirm') {
  
      // }
    }
  async showDeliveryModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeliveryComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
            updateTranctorStatus:false
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
     this.getTractorDetails('Refreshing Data...');
    }
  }
    async viewTractorDashboard(){
      const modal = await this.modalCtrl.create({
        component: RepairTractorDashboardComponent,
        componentProps: {
          updateTranctorStatus:false,
          tractorDetails: this.tractorDetails
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  //    if (role === 'confirm') {
      this.getTractorDetails('Refreshing Data...')
    //  }
    }
   async viewImage(){
      const modal = await this.modalCtrl.create({
        component: ImageDashboardComponent,
        componentProps: {
       
          tarctor_id: this.tractorDetails.id,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
        this.getTractorDetails('Refreshing Data...')
      }
    }
      async startRepairing() {
        const modal = await this.modalCtrl.create({
          component: StartRepairDialogComponent,
          componentProps: {
            tractorDetails: this.tractorDetails,
            updateTranctorStatus:false
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        if (role === 'confirm') {
          this.getTractorDetails('Refreshing Data...');
        }
      }
     async addSellDetails(){
        const modal = await this.modalCtrl.create({
          component: TractorSellsDetailsComponent,
          componentProps: {
            tractorDetails: this.tractorDetails,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        //if (role === 'confirm') {
          this.getTractorDetails('Refreshing Data...');
        //}
      }
      async addFinanceDetails(){
        const modal = await this.modalCtrl.create({
          component: TractorFinanceDetailsComponent,
          componentProps: {
            tractorDetails: this.tractorDetails,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        //if (role === 'confirm') {

          this.getTractorDetails('Refreshing Data...');
        //}
      }
      async addDocument(){
        const modal = await this.modalCtrl.create({
          component: SellDocumentComponent,
          componentProps: {
            tractorDetail: this.tractorDetails,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        //if (role === 'confirm') {
          this.getTractorDetails('Refreshing Data...');
        //}
      }
      async AddOtherExpense(){
        const modal = await this.modalCtrl.create({
          component: OtherExpenseListComponent,
          componentProps: {
            tarctor_id: this.tractorDetails?.id,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
    
        //if (role === 'confirm') {
          this.getTractorDetails('Refreshing Data...');
        //}
      }
      backToSrcPage() {
        this.route.navigate([this.srcPage]);
      }
      doArchive(){
    let objData: any = {
      tractor_status: 'ARCHIVED',
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractorDetails?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Archived Successfully...');
  
      //  this.dismiss();
    });
      }
        async archivedAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Send To Archived',
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
      this.doArchive();
    }
  }

 async sendDraftAlert(){
     const alert = await this.alertCtrl.create({
      header: 'Send To Draft',
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
      this.doDraft();
    }
  }
        doDraft(){
    let objData: any = {
      tractor_status:null,
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractorDetails?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Archived Successfully...');
  
      //  this.dismiss();
    });
      }
}
