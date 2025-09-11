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
  selector: 'app-select-district-model',
  templateUrl: './select-district-model.component.html',
  styleUrls: ['./select-district-model.component.scss'],
})
export class SelectDistrictModelComponent  implements OnInit {
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
  this.modalCtrl.dismiss({district_id:this.district_id,state_id:this.state_id})
}
  ngOnInit() {this.getStateList()}
    stateList: any = [];
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
  
        this.getDistrictList();
      },
      (error: any) => {}
    );
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    let openStatus = this.checkOpenCon(itemName);
    if(openStatus){

   
    let otherObjects: any;
    if (itemName == 'District') {
      list=this.districtListFilter
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
            showAddButton:false,
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
        this.district_id=null;
        this.districtName = null;
        this.stateName = data?.name;
        this.getDistrictListFilter();
      }
    } else if (itemName == 'District') {
      this.districtName = data?.name;
      this.district_id=data?.id;
    }
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }else{
    this.share.presentToast("Please Select State First")
  }
  }
    stateName: any;
    district_id: any;
  districtName: any;
  districtList: any = [];
  getDistrictList() {
    let obj = this.share.getListObj('district_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.districtList = res?.data;
        let find= this.districtList.find((d:any)=>d.id==this.district_id)  
        if(find){
          this.districtName = find?.name;
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
      itemName == 'District' &&
      this.state_id
    ) {
      if(this.districtListFilter?.length){
        return true;
      }else{
        this.getDistrictListFilter()
   
        return true;
      }
   
    } else {
      return false;
    }
  }
    districtListFilter: any = [];
    state_id:any
  getDistrictListFilter() {
    let getStateId = this.state_id;
    let districtList = this.districtList.filter((f: any) => f.state_id == getStateId);
    this.districtListFilter = districtList;
  }
}
