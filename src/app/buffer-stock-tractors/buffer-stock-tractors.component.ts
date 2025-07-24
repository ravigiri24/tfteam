import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { ImageViewerComponent } from '../maintainance-management/image-viewer/image-viewer.component';
import { AlertController, ModalController } from '@ionic/angular';
import { ImageDashboardComponent } from '../maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from '../maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { Router } from '@angular/router';
import { FilterByPageComponent } from './filter-by-page/filter-by-page.component';
import { SearchTractorWithTfCodeComponent } from '../shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SyncTractorWithMaintaninanceComponent } from '../shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
@Component({
  selector: 'app-buffer-stock-tractors',
  templateUrl: './buffer-stock-tractors.component.html',
  styleUrls: ['./buffer-stock-tractors.component.scss'],
})
export class BufferStockTractorsComponent implements OnInit {
  constructor(
    private api: ApiService,
    private share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}
  buffertractorList: any = [];
  ngOnInit() {}
  ionViewWillEnter() {
    this.buffertractorList = [];
    this.getTractorList();
    this.filterBy = 'ALL';
  }
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
  listBy='BUFFER'
  selectLiSTYPE(){
    if(this.listBy=='BUFFER'){
  this.buffertractorList=  this.buffertractorList.filter((f:any)=>f.tractor_status!='ARCHIVED')
    }else if(this.listBy=='ARCHIVED'){
  this.buffertractorList=  this.buffertractorList.filter((f:any)=>f.tractor_status=='ARCHIVED')
    }
  }
  sortByFilter() {

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
    this.selectLiSTYPE()
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
    this.api.postapi('getBufferTractorList', obj).subscribe(
      (res: any) => {
        this.buffertractorList = res.data;
        this.allTractorsSrcList = res.data;
        this.sortByFilter();

        this.share.spinner.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
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
      this.share.spinner.dismiss();
      this.clearMappedJob(tractor);
      this.share.presentToast('Deleted Successfully...');
      this.getTractorList();
      //  this.dismiss();
    });
  }
  async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {},
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
}
