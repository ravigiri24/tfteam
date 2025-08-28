import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from '../select-with-search/select-with-search.component';
import { ModalController } from '@ionic/angular';
import { AddDistrictComponent } from './add-district/add-district.component';
import { AddCityComponent } from './add-city/add-city.component';
@Component({
  selector: 'app-district-management',
  templateUrl: './district-management.component.html',
  styleUrls: ['./district-management.component.scss'],
})
export class DistrictManagementComponent implements OnInit {
  constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private modalCtrl: ModalController
  ) {}
  listColorClass = 'firstColor';
  ngOnInit() {}
  backToNewArrivals() {
    this.router.navigate([this.srcPage]);
  }
  staffDetails: any;
  srcPage: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
    this.getStateList();
  }
  stateName: any;
  async selectItem(list: any, itemName: any, table_name: any) {
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
        otherObjects: otherObjects,
        jsonKey: 'name',
        search: {
          name: null,
        },
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (itemName == 'State') {
      if (data) {
        this.selectedState = data?.id;
        this.stateName = data?.name;
        this.getDistrictList();
      }
    }
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  selectedState: any;

  stateList: any = [];
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        this.selectedState = this.stateList[0].id;
        this.stateName = this.stateList[0]?.name;
        this.getDistrictList();
      },
      (error: any) => {}
    );
  }
  districtList: any = [];
  districtListSrc: any = [];
  getDistrictList() {
    this.districtList = [];
    let obj = this.share.getListObj('district_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.districtListSrc = res?.data;
        this.districtWiseFIlter();
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  buttonArray: any = [
    {
      name: 'Edit District',
      action: 'EditDistrict',
      image: './././assets/images/edit.png',
    },
       {
      name: 'Add City',
      action: 'addCityInDistrict',
      image: './././assets/images/location-pin.png',
    }
  ];
  search: any = {
    name: null,
  };
  updateItemIndex: any;
  actionEventCall(e: any) {
    if (e?.button?.name == 'Edit District') {
      this.updateItemIndex = e?.index;
      this.addDistrict(e?.item);
    }
     if (e?.button?.name == 'Add City') {
      this.updateItemIndex = e?.index;
      this.addCityInDistrict(e?.item);
    }
  }
  districtWiseFIlter() {
    this.districtList = this.districtListSrc.filter(
      (f: any) => f.state_id == this.selectedState
    );
  }
  async addDistrict(district: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddDistrictComponent,
      breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.7,
      cssClass: 'custom-modal',
      componentProps: {
        district: district,
        state_id: this.selectedState,
        stateName: this.stateName,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data?.rowData && !district?.name) {
      this.districtList.unshift(data?.rowData);
    }
    if (data?.rowData && district?.name) {
      this.districtList[this.updateItemIndex] = data?.rowData;
    }
  }
    async addCityInDistrict(district: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddCityComponent,

      cssClass: 'custom-modal',
      componentProps: {
        district: district,
    
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  
  }
}
