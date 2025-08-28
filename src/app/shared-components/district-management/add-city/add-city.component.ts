import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from '../../select-with-search/select-with-search.component';
@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss'],
})
export class AddCityComponent implements OnInit {
  district: any;
  search: any = {
    name: null,
  };
  constructor(
    private modalCtrl: ModalController,
    public share: ShareService,
    private api: ApiService,
    private alertCtrl: AlertController
  ) {}
  listColorClass: any = 'secondColor';
  staffDetails: any;
  ngOnInit() {
    let getStaffDetail: any = this.share.get_staff();
    this.staffDetails = JSON.parse(getStaffDetail);
    this.getCityListByDistrict();
    this.getCityList();
    this.getDistrictList()
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  cityList: any = [];
  buttonArray: any = [
    {
      name: 'Remove City',
      action: 'RemoveCity',
      image: './././assets/images/deleted.png',
    },
  ];
  actionEventCall(e: any) {
    if (e?.button?.name == 'Remove City') {
      this.deleteAlert(e?.item);
    }
  }

  getCityListByDistrict() {
    this.selectedCityList = [];
    let obj: any = this.share.getListObj('get_city', false, [], true);
    obj.district_id = this.district?.id;
    this.share.showLoading('Getting Data');
    this.api.postapi('getCityByDistrict', obj).subscribe(
      (res: any) => {
        this.selectedCityList = res?.data;

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  selectedCityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        this.cityList = this.cityList.filter(
          (d: any) => d.state_id == this.district?.state_id
        );

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  districtList:any=[]
    getDistrictList() {
    let obj = this.share.getListObj('district_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.districtList = res?.data;
        this.districtList = this.districtList.filter(
          (d: any) => d.state_id == this.district?.state_id
        );

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    let otherObjects: any = {};

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
    console.log('data', data);

    console.log('role', role, data);
    if (data) {
   
      if (data?.district_id ==null) {
        this.addCityInDistrict(data);
      } else if(data?.district_id !=this.district?.id){
        this.showOverwriteAlert(data)
       
      }
      else if(data?.district_id ==this.district?.id){
        this.share.presentToast("This City Already Exist in this District")
       
      }
    }
    if (role === 'confirm') {
    }
  }
  addCityInDistrict(city: any) {
    let obj = {
      src: 'city_list',
      data: {
        district_id: this.district?.id,
      },
      id: city?.id,
    };
    this.share.showLoading('Adding City');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.share.spinner.dismiss();
        this.getCityListByDistrict();
      },
      (error: any) => {}
    );
  } 
  async showOverwriteAlert(item:any) {
    let district=this.districtList?.find((f:any)=>f.id==item?.district_id)
    let header= 'This City Alerady Added In '+district?.name
    let message='Are You Sure to add in '+this.district?.name +' and remove from '+district?.name
     const alert = await this.alertCtrl.create({
      header: header,
      subHeader: '',
      message:message,
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
         this.addCityInDistrict(item);;
    }
  }
  async deleteAlert(item:any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove City From District',
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
      this.removeItem(item);
    }
  }
  removeItem(city: any) {
    let obj = {
      src: 'city_list',
      data: {
        district_id: null,
      },
      id: city?.id,
    };
    this.share.showLoading('Removing City');
    this.api.postapi('updateOpp', obj).subscribe(
      (res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast("Remove CIty Successfully")
        this.getCityListByDistrict();
        
      },
      (error: any) => {}
    );
  }
}
