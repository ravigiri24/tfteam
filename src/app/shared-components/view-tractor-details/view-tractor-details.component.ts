import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';

@Component({
  selector: 'app-view-tractor-details',
  templateUrl: './view-tractor-details.component.html',
  styleUrls: ['./view-tractor-details.component.scss'],
})
export class ViewTractorDetailsComponent  implements OnInit {

  
  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private route:Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {


  }

  tractor_Details:any
  tractor_id:any
  ionViewWillEnter() {
    // this.activatedRoute.params.subscribe((params: any) => {
    //   this.tractor_id = params?.id;
    // });
   // this.getTractorDetails()
   this.tractor_id=this.tractorDetails?.id
  }
  async viewImage(imageGroup:any){
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
     
        tarctor_id: this.tractorDetails?.id,
        imageGroup:imageGroup,
        uploadPhoto:false
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
   async viewImageLive(){
 
   let imageArray:any=[]
   if(this.tractorDetails?.leftImageUrl){
   imageArray.push({imageUrlUrl:this.tractorDetails?.leftImageUrl})
   }
   if(this.tractorDetails?.rightImageUrl){
    imageArray.push({imageUrlUrl:this.tractorDetails?.rightImageUrl})
   }
   if(this.tractorDetails?.frontImageUrl){
    imageArray.push({imageUrlUrl:this.tractorDetails?.frontImageUrl})
   }
 if(this.tractorDetails?.backImageUrl){
  imageArray.push({imageUrlUrl:this.tractorDetails?.backImageUrl})
 }
 
 
      const modal = await this.modalCtrl.create({
        component: ImageViewerComponent,
        componentProps: {
       
          tarctor_id: this.tractorDetails?.id,
          imageGroup:null,
          uploadPhoto:false,
          imageArray:imageArray,
          callApi:false
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
     
      }
    }
 
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  backToList(){
    this.route.navigate(['/operational/all-tractor-management'])
  }
  openEdit() {
    this.route.navigate(['/operational/edit-newarrivals', this.tractorDetails.rowCode,'/operational/all-tractor-management']);
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
  staffDetails:any
  getTractorDetails(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractorDetails?.id,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorByIdAllDetails', obj).subscribe(
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
          tractor_id: this.tractorDetails?.id,
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
}
