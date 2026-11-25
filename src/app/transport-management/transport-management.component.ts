import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ConfirmDeliveryComponent } from './confirm-delivery/confirm-delivery.component';
import { ModalController } from '@ionic/angular';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import { AddTransportStatusComponent } from './add-transport-status/add-transport-status.component';
import { StartRepairDialogComponent } from './start-repair-dialog/start-repair-dialog.component';
import { StartTransportDialogComponent } from './start-transport-dialog/start-transport-dialog.component';
import { TransportOptionsComponent } from './transport-options/transport-options.component';
import { CommonMethodService } from '../common-method.service';
import { SearchTractorWithTfCodeComponent } from '../shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { OutwardHistoryComponent } from './outward-history/outward-history.component';
@Component({
  selector: 'app-transport-management',
  templateUrl: './transport-management.component.html',
  styleUrls: ['./transport-management.component.scss'],
})
export class TransportManagementComponent implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    public share: ShareService,
    private api: ApiService,
    private route: Router,
    public modalCtrl: ModalController,
    private commonMethod:CommonMethodService
  ) {}

  ngOnInit() {}
  listColorClass='sixColor'
  transportList: any = [];
  transportDirection: 'Inward' | 'Outward' = 'Inward';
  private listRequestId = 0;

  async openOutwardHistory() {
    const modal = await this.modalCtrl.create({
      component: OutwardHistoryComponent,
      cssClass: 'custom-modal',
    });
    await modal.present();
  }
    async searchTractor() {
       let buttonArray = JSON.parse(JSON.stringify(this.buttonArray))
       buttonArray.push({
      name: 'Allot Store',
      action: 'allotHistory',
      image: './././assets/images/assign.png',
    },
  {
      name: 'Start Outward',
      action: 'startOutward',
      image: './././assets/images/transfer.png',
    })
     
        const modal = await this.modalCtrl.create({
          component: SearchTractorWithTfCodeComponent,
          componentProps: {
           buttonArray: buttonArray,
           listColorClass:this.listColorClass,
           keyList:this.keyList,
           searchFilter:this.search,
           searchKey:'registractionNo',
         obj:{optionsUploadButtonArray:[]}
          },
              cssClass: 'midium-model',
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
      if(this.commonMethod.reloadMethod){
    this.refreshList()
  }
        if (role === 'confirm') {
        }
      }
  ionViewWillEnter() {
    this.refreshList();
  }

  changeTransportDirection(direction: 'Inward' | 'Outward') {
    if (direction === this.transportDirection) return;
    this.transportDirection = direction;
    this.refreshList();
  }
        buttonArray: any = [
 {
      name: 'Add Transport Cost',
      action: 'addTransportCost',
      closeCurrentPopUP:true,

      image: './././assets/images/rupee-sign.png',
    },
     {
      name: 'Start Transport',
      action: 'startTransport',
 

      image: './././assets/images/delivery-truck.png',
    },
      {
      name: 'More option Transport',
      action: 'moreOptionTransport',
      image: './././assets/images/laptop.png',
    },
 
    
    {
      name: 'Delete Tractor',
      action: 'deleteTractor',
      image: './././assets/images/deleted.png',
    },
  ];
     keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
        { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },

    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },

    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Engine Number', getFromObj:true,objName:'purchasedetail',value: 'engineNumber', type: 'INPUT' },
    { key: 'Chassis Number', getFromObj:true,objName:'purchasedetail',value: 'chasisNumber', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  search={
    registractionNo:null
  }
    async actionEventCall(e: any) {
      await  this.commonMethod.actionEventCall(e,{optionsUploadButtonArray:[]})
    
  if(this.commonMethod.reloadMethod){
    this.refreshList()
  }

    console.log('actionEventCall', e);
    
  }
      async viewImage(image:any){
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

  startRepairingApi(tractor: any) {
    let obj;

    obj = {
      data: { tractor_status: 'AT_REPAIR_CENTER' },
      src: 'tractor',
      id: tractor?.id,
    };

    this.share.showLoading('Updating...');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.refreshList();
        this.share.presentToast('Updated Successfully...');
      },
      (error: any) => {}
    );
  }
  // newArivalsList:any=[]
  backupList: any = [];
  userDetails: any;
  staffDetails: any;
  goToNewArival(data: any = null) {
    this.route.navigate(['/operational/add-new-arrivals']);
  }
  addCost(tractor: any) {
    this.route.navigate(['/transport-department/add-cost', tractor?.id]);
  }
    async startTranspotation(tractor: any) {
      const modal = await this.modalCtrl.create({
        component: StartTransportDialogComponent,
        componentProps: {
          tractorDetails: tractor,
      
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
        this.refreshList('Refreshing Data...');
      }
    }
  getTractorList(loadingMsg = 'Loading...') {
    this.loadTransportList('getTractorList', loadingMsg);
  }

  getOutwardTransportTractor(loadingMsg = 'Loading...') {
    this.loadTransportList('getOutwardTransportTractor', loadingMsg);
  }

  private loadTransportList(endpoint: 'getTractorList' | 'getOutwardTransportTractor', loadingMsg: string) {
    const requestId = ++this.listRequestId;
    this.staffDetails = JSON.parse(this.share.get_staff() || 'null');
    const obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.share.showLoading(loadingMsg);
    this.transportList = [];
    this.backupList = [];
    this.api.postapi(endpoint, obj).pipe(finalize(() => {
      if (requestId === this.listRequestId) this.share.spinner.dismiss('active_six');
    })).subscribe({
      next: (res: any) => {
        if (requestId !== this.listRequestId) return;
        this.backupList = Array.isArray(res?.data) ? res.data : [];
        this.transportList = endpoint === 'getTractorList'
          ? this.backupList.filter((tractor: any) => tractor?.tractor_status === 'AT_TRANSPORT')
          : this.backupList;
        this.transportList.forEach((tractor: any) => {
          const beforeService = tractor.rawImages?.filter((image: any) => image.imageGroup === 'BEFORE_SERVICE');
          tractor.beforeServiceImages = beforeService;
          if (beforeService?.length) tractor.imageUrlUrl = beforeService[0]?.imageUrlUrl;
        });
      },
      error: () => {
        if (requestId !== this.listRequestId) return;
        this.share.presentToast('Unable to load transport records. Please try again.');
      },
    });
  }
  tractor_id: any;
  addStatus(tractor: any) {
    this.showModal(tractor?.id);
  }
  async showDeliveryModal(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeliveryComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
      this.refreshList('Refreshing Data...');
    }
  }
    async startRepairing(tractor: any) {
      const modal = await this.modalCtrl.create({
        component: StartRepairDialogComponent,
        componentProps: {
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
        this.refreshList('Refreshing Data...');
      }
    }

  async startReparinConfiemation(tractor: any) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: '',
      message: 'You want to Start the Repair!',
      buttons: ['Yes,Start!', 'Cancel'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.startRepairingApi(tractor);
    }
    console.log(result);
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
  refreshList(loadingMsg = 'Loading...') {
    if (this.transportDirection === 'Outward') {
      this.getOutwardTransportTractor(loadingMsg);
    } else {
      this.getTractorList(loadingMsg);
    }
  }
  dataClear() {}
  tractorDashboard(tractor: any) {
    this.route.navigate(['/operational/view-dashboard', tractor?.id]);
  }
   async openOptions(tractor:any){
      const modal = await this.modalCtrl.create({
        component: TransportOptionsComponent,
        componentProps: {
       
          tractor: tractor,
     
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  if(data?.isDeleted || data?.isForworded || data?.isReached ){
    this.refreshList('Refreshing Data...')
  }
      if (role === 'confirm') {
     
      }
    }
}
