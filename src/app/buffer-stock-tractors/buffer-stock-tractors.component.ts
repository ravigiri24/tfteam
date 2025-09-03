import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { ImageViewerComponent } from '../maintainance-management/image-viewer/image-viewer.component';
import { AlertController, ModalController } from '@ionic/angular';
import { ImageDashboardComponent } from '../maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from '../maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { Router } from '@angular/router';
import { FilterByPageComponent } from './filter-by-page/filter-by-page.component';
import { TractorCostingDashboardComponent } from '../shared-components/tractor-costing-dashboard/tractor-costing-dashboard.component';
import { SearchTractorWithTfCodeComponent } from '../shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SyncTractorWithMaintaninanceComponent } from '../shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { CommonMethodService } from '../common-method.service';
import { DeleteTractorComponent } from '../shared-components/delete-tractor/delete-tractor.component';
@Component({
  selector: 'app-buffer-stock-tractors',
  templateUrl: './buffer-stock-tractors.component.html',
  styleUrls: ['./buffer-stock-tractors.component.scss'],
})
export class BufferStockTractorsComponent implements OnInit {
  listColorClass = 'fifthColor';
  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController,
    private commonMethod: CommonMethodService
  ) {}
  buffertractorList: any = [];
  ngOnInit() {}
  ionViewWillEnter() {
    this.buffertractorList = [];
    this.getTractorList();
    this.filterBy = 'ALL';
  }
    async deleteTractor(tractor: any) {
      const modal = await this.modalCtrl.create({
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.4,
        cssClass: 'custom-modal',
        component: DeleteTractorComponent,
        componentProps: {
          tractor:tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
    this.refreshList()
      }
    }
  async actionEventCall(e: any) {
      await  this.commonMethod.actionEventCall(e,{optionsUploadButtonArray:[]})
    
  if(this.commonMethod.reloadMethod){
    this.getTractorList()
  }
  //   if(e?.button?.name == 'Tractor Dashboard') {
  //     this.tractorDashboard(e?.tractor);
  //   } 
  //   else if(e?.button?.name == 'Sync Mainatainance') {
  //     this.syncManitainance(e?.tractor);
  //   }
  //    else if(e?.button?.name == 'Tractor Summary') {
  //     this.tractorViewDetail(e?.tractor);
  //   }
  // else if(e?.button?.name == 'Delete Tractor') {
  //     this.deleteTractor(e?.tractor);
  //   }


    if (this.commonMethod.reloadMethod) {
      this.refreshList();
    }
    console.log('actionEventCall', e);
    
  }
      buttonArray: any = [
 {
      name: 'Tractor Dashboard',
      action: 'tractorDashboard',
            closeCurrentPopUP:true,
    srcPage:'/operational/buffer-stock',
      image: './././assets/images/layout.png',
    },
     {
      name: 'Sync Mainatainance',
      action: 'syncMainatinance',
      image: './././assets/images/sync.png',
    },
      {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
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
    { key: 'Engine Number', value: 'engineNumber', type: 'INPUT' },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'D.O.A(Actual)', value: 'actualReleaseDate', type: 'INPUT' },

    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },

    { key: 'Hours', value: 'hours', type: 'INPUT' },
        { key: 'Transported Place', getFromObj:true,objName:'transportDestination',value: 'name', type: 'INPUT' },
        { key: 'Franchise(Alloted)', getFromObj:true,objName:'franchiseDettails',value: 'name', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  refreshList() {
    this.getTractorList();
  }
  filterBy: any = 'ALL';
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: FilterByPageComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.4,
      cssClass: 'custom-modal',
      componentProps: {
        filterBy: this.filterBy,
        listBy: this.listBy,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data && data?.isFilterChange) {
      console.log('data', data);
      this.filterBy = data?.filterBy;
      this.listBy = data?.listBy;
      this.sortByFilter();
    }
  }
  listBy = 'BUFFER';
  selectLiSTYPE() {
    if (this.listBy == 'BUFFER') {
      this.buffertractorList = this.buffertractorList.filter(
        (f: any) => f.tractor_status != 'ARCHIVED'
      );
    } else if (this.listBy == 'ARCHIVED') {
      this.buffertractorList = this.buffertractorList.filter(
        (f: any) => f.tractor_status == 'ARCHIVED'
      );
    }
  }
  sortByFilter() {
        this.buffertractorList=[]
        setTimeout(() => {
           if (this.filterBy == 'ALL') {
      if (this.allTractorsSrcList?.length) {
        this.buffertractorList = JSON.parse(
          JSON.stringify(this.allTractorsSrcList)
        );
      } else {
        this.buffertractorList = [];
      }
    }
    if (this.filterBy == 'MAPPED') {
      this.buffertractorList = this.allTractorsSrcList.filter(
        (f: any) => f?.repairMappedData?.length > 0
      );
    }
    if (this.filterBy == 'NOT_MAPPED') {
      this.buffertractorList = this.allTractorsSrcList.filter(
        (f: any) => f?.repairMappedData?.length == 0
      );
    }
    this.selectLiSTYPE();
        }, 0);
   
  }
  staffDetails: any;
  allTractorsSrcList: any = [];
  getTractorList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.share.showLoading('Loading...');
    this.buffertractorList=[]
    this.api.postapi('getBufferTractorList', obj).subscribe(
      (res: any) => {
        this.buffertractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        this.sortByFilter();

        this.share.spinner.dismiss('active_five');
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
  async tractorViewDetail(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorCostingDashboardComponent,
      componentProps: {
        tractor_id: tractor?.id,
        
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    //   this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
  }
  async viewImage(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: ImageDashboardComponent,
      componentProps: {
        tarctor_id: tractor.id,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async viewTractorDashboard(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: RepairTractorDashboardComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    this.getTractorList();
  }
  search = {
    registractionNo: null,
  };
  backupList: any = [];
  tractorDashboard(tractor: any) {
    this.router.navigate([
      '/operational/view-dashboard',
      tractor?.id,
      '/operational/buffer-stock',
    ]);
  }

  async syncManitainance(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: SyncTractorWithMaintaninanceComponent,
      componentProps: {
        tractor: tractor,
      },
    });
    await modal.present();
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
  async deleteItem(tractor: any) {
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
      this.removeJob(tractor);
    }
  }
  clearMappedJob(tractor: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: tractor?.id,
    };

    this.api.postapi('clearMappedJob', obj).subscribe((res: any) => {
      //  this.dismiss();
    });
  }
  removeJob(tractor: any) {
    let objData: any = {
      isDeleted: true,
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: tractor?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss('active_five');
      this.clearMappedJob(tractor);
      this.share.presentToast('Deleted Successfully...');
      this.getTractorList();
      //  this.dismiss();
    });
  }
    async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
       buttonArray: this.buttonArray,
       listColorClass:this.listColorClass,
       keyList:this.keyList,
       searchFilter:this.search,
       searchKey:'registractionNo',
     obj:{optionsUploadButtonArray:[]}
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  // async searchTractor() {
  //   const modal = await this.modalCtrl.create({
  //     component: SearchTractorWithTfCodeComponent,
  //     componentProps: {},
  //   });
  //   await modal.present();
  //   const { data, role } = await modal.onWillDismiss();
  //   console.log('role', role);

  //   if (role === 'confirm') {
  //   }
  // }
}
