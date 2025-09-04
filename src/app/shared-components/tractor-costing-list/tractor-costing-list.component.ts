import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from '../tractor-dashboard/tractor-dashboard.component';

import { Router } from '@angular/router';
import { TractorCostingDashboardComponent } from '../tractor-costing-dashboard/tractor-costing-dashboard.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { SearchTractorWithTfCodeComponent } from '../search-tractor-with-tf-code/search-tractor-with-tf-code.component';
@Component({
  selector: 'app-tractor-costing-list',
  templateUrl: './tractor-costing-list.component.html',
  styleUrls: ['./tractor-costing-list.component.scss'],
})
export class TractorCostingListComponent implements OnInit {
  constructor(
    private api: ApiService,
    public share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private commonMethod:CommonMethodService
  ) {}
  alltractorList: any = [];
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];

    this.getBrandList();
  }
  listColorClass = 'secondColor';
  buttonArray: any = [
    {
      name: 'Tractor Summary',
      action: 'tractorSummary',
      image: './././assets/images/data-analysis.png',
    },
  ];
  keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    {
      key: 'Engine Number',
      getFromObj: true,
      objName: 'purchasedetail',
      value: 'engineNumber',
      type: 'INPUT',
    },
    {
      key: 'Chassis Number',
      getFromObj: true,
      objName: 'purchasedetail',
      value: 'chasisNumber',
      type: 'INPUT',
    },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
    { key: 'D.O.A(Actual)', value: 'actualReleaseDate', type: 'INPUT' },

    { key: 'Is Sold', value: 'isSold', type: 'CONDITIONAL' },

    { key: 'Hours', value: 'hours', type: 'INPUT' },
    {
      key: 'Transported Place',
      getFromObj: true,
      objName: 'transportDestination',
      value: 'name',
      type: 'INPUT',
    },
    {
      key: 'Franchise(Alloted)',
      getFromObj: true,
      objName: 'franchiseDettails',
      value: 'name',
      type: 'INPUT',
    },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  search = {
    registractionNo: null,
  };
  async actionEventCall(e: any) {
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });

    if (this.commonMethod.reloadMethod) {
      this.getTractorList();
    }

    console.log('actionEventCall', e);
  }
  refreshList() {
    this.getTractorList();
  }
  brandList: any = [];
  selectedBrand: any;
  getBrandList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('brand', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.brandList = res?.data;
          this.brandList = this.brandList.reverse();

          console.log('  this.brandList', this.brandList);
          if (!loader) {
            this.selectedBrand = this.brandList[0]?.id;

            this.getTractorList();
            //   this.share.spinner?.dismiss();
          }
        },
        (error: any) => {}
      );
    }, 0);
  }
  getListByBrand() {
    console.log('getListByBrand', this.selectedBrand);
    this.getTractorList(true);
  }
  staffDetails: any;

  getTractorList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      brandId: this.selectedBrand,
    };
    if (loader) {
      this.share.showLoading('Loading...');
    }
       this.alltractorList=[]
    this.api.postapi('getTractorListBranchWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')

        this.share?.spinner?.dismiss('active_two');
        this.backupList = res.data;
      },
      (error: any) => {}
    );
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
  async viewImage(tractor: any) {
    // const modal = await this.modalCtrl.create({
    //   component: ImageViewerComponent,
    //   componentProps: {
    //     tarctor_id: tractor.id,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);
    // if (role === 'confirm') {
    // }
  }
  async viewTractorDashboard(tractor: any) {
    const modal = await this.modalCtrl.create({
      component: TractorDashboardComponent,
      componentProps: {
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    this.getTractorList();
  }
  backupList: any = [];
  async tractorDashboard(tractor: any) {
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
  backToList() {
    this.router.navigate(['/operational/all-tractor-management']);
  }
}
