import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TractorOptionsViewComponent } from './tractor-options-view/tractor-options-view.component';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import { StartTransportDialogComponent } from '../transport-management/start-transport-dialog/start-transport-dialog.component';
import { EnterTfCodeComponent } from '../operational/enter-tf-code/enter-tf-code.component';
import { CommonMethodService } from '../common-method.service';
import { SearchTractorWithTfCodeComponent } from '../shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
@Component({
  selector: 'app-new-arrivals-management',
  templateUrl: './new-arrivals-management.component.html',
  styleUrls: ['./new-arrivals-management.component.scss'],
})
export class NewArrivalsManagementComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public share: ShareService,
    private api: ApiService,
    private route: Router,
    private commonMethod: CommonMethodService
  ) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.newArivalsList = [];
    this.getTractorList();
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
      this.getTractorList('Refreshing Data...');
    }
  }
  async showAlert(tractor: any, i: any) {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      subHeader: '',
      message: 'You want to Start the trasportation!',
      buttons: ['Yes,Transport It!', 'Cancel'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (!result?.role) {
      this.startTransport(tractor);
    }
    console.log(result);
  }
  startTransport(tractor: any) {
    let obj;

    obj = {
      data: { tractor_status: 'AT_TRANSPORT' },
      src: 'tractor',
      id: tractor?.id,
    };

    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.getTractorList();
      },
      (error: any) => { }
    );
  }
  newArivalsList: any = [];
  backupList: any = [];
  userDetails: any;
  staffDetails: any;
  goToNewArival(data: any = null) {
    let rand = Math.random()
    this.route.navigate(['/purchase-management/add-new-arrivals', rand, '/purchase-management/new-arrivals']);
  }
  openEdit(tractor: any) {
    this.route.navigate(['/purchase-management/edit-newarrivals', tractor?.rowCode, '/purchase-management/new-arrivals']);
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
  listColorClass = 'sevenColor'
  buttonArray: any = [
    {
      name: 'Edit Tractors New Arrivals',
      action: 'editTractorNewArriwals',
      closeCurrentPopUP: true,
      srcPage: '/purchase-management/new-arrivals',
      image: './././assets/images/edit.png',
    },
    {
      name: 'Assign TF',
      action: 'assignTFCOde',
      showOnCondition: true,
      objName: 'registractionNo',
      obVal: null,
      objNameSecond: 'isBackDateEntry',
      obValSecond: "0",
      image: './././assets/images/assigntfcode.png',
    },
    {
      name: 'BackDate TF Assign',
      action: 'assignOldTFCOde',
      showOnCondition: true,
      objName: 'isBackDateEntry',
      obVal: "1",

      image: './././assets/images/assigntfcode.png',
    },
    {
      name: 'Open Options New Arrivals',
      action: 'openNewArriwalOptions',
      image: './././assets/images/settings.png',
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
    { key: 'Is BackDate Entry', value: 'isBackDateEntry', type: 'CONDITIONAL' },
    { key: 'Engine Number', getFromObj: true, objName: 'purchasedetail', value: 'engineNumber', type: 'INPUT' },
    { key: 'Chassis Number', getFromObj: true, objName: 'purchasedetail', value: 'chasisNumber', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  async searchTractor() {
    const modal = await this.modalCtrl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
        buttonArray: this.buttonArray,
        listColorClass: this.listColorClass,
        keyList: this.keyList,
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: [] },
            cssClass: 'midium-model',
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.newArivalsList = []
    this.share.showLoading(msg);
    this.api.postapi('getTractorList', obj).subscribe(
      (res: any) => {
        this.newArivalsList = res.data;
        this.newArivalsList = this.newArivalsList.filter(
          (f: any) => f?.tractor_status == 'NEW_ARRIVAL'
        );
        this.newArivalsList?.forEach((tract: any) => {
          let beforeService = tract?.rawImages?.filter((f: any) => f.imageGroup == 'BEFORE_SERVICE')
          tract.beforeServiceImages = beforeService
          if (tract.beforeServiceImages?.length) {
            tract.imageUrlUrl = tract.beforeServiceImages[0]?.imageUrlUrl
          }
        });
        this.share?.spinner?.dismiss('active_seven');
        this.backupList = res.data;
      },
      (error: any) => { }
    );
  }
  search = {
    registractionNo: null
  }
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })

    if (this.commonMethod.reloadMethod) {
      this.getTractorList()
    }

    console.log('actionEventCall', e);

  }
  refreshList() {
    this.getTractorList();
  }
  dataClear() { }

  async openOptions(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorOptionsViewComponent,
      componentProps: {

        tractor: tractor,

      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if (data?.isDeleted || data?.isForworded) {
      this.getTractorList('Refreshing Data...')
    }
    if (role === 'confirm') {

    }
  }
}