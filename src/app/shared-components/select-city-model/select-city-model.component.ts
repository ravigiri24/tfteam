import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
@Component({
  selector: 'app-select-city-model',
  templateUrl: './select-city-model.component.html',
  styleUrls: ['./select-city-model.component.scss'],
})
export class SelectCityModelComponent  implements OnInit {
 constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}
dismiss(){
  this.modalCtrl.dismiss()
}
addCity(){
  this.modalCtrl.dismiss({city_id:this.city_id,state_id:this.state_id})
}
  ngOnInit() {this.getStateList()}
    stateList: any = [];
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
  
        this.getCityList();
      },
      (error: any) => {}
    );
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    let openStatus = this.checkOpenCon(itemName);
    if(openStatus){

   
    let otherObjects: any;
    if (itemName == 'City') {
      list=this.cityListFilter
      otherObjects = {
        state_id: this.state_id,
      };
    }

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
        otherObjects: otherObjects,
        jsonKey:'name',
        search:  {
          name: null,
        }
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (itemName == 'State') {
      if (data) {
        this.state_id=data?.id;
        this.city_id=null;
        this.cityName = null;
        this.stateName = data?.name;
        this.getCityListFilter();
      }
    } else if (itemName == 'City') {
      this.cityName = data?.name;
      this.city_id=data?.id;
    }
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }else{
    this.share.presentToast("Please Select State First")
  }
  }
    stateName: any;
    city_id: any;
  cityName: any;
  cityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        let find= this.cityList.find((d:any)=>d.id==this.city_id)  
        if(find){
          this.cityName = find?.name;
        } 
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (
      itemName == 'City' &&
      this.state_id
    ) {
      if(this.cityListFilter?.length){
        return true;
      }else{
        this.getCityListFilter()
   
        return true;
      }
   
    } else {
      return false;
    }
  }
    cityListFilter: any = [];
    state_id:any
  getCityListFilter() {
    let getStateId = this.state_id;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
}
