import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { AlertController, ModalController } from '@ionic/angular';
import { SelectDistrictModelComponent } from 'src/app/shared-components/select-district-model/select-district-model.component';
@Component({
  selector: 'app-assined-stores',
  templateUrl: './assined-stores.component.html',
  styleUrls: ['./assined-stores.component.scss'],
})
export class AssinedStoresComponent  implements OnInit {
  constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl:AlertController
  ) {}
  listColorClass = 'firstColor';
  staff: any 
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getDistictAllotedToStaff();
    this.getStateList();
  }
  backToNewArrivals() {
    this.router.navigate([this.srcPage]);
  }
  staffDetails: any;
  srcPage: any;
  ionViewWillEnter() {
    // this.activatedRoute.params.subscribe((params: any) => {
    //   this.srcPage = params?.srcPage;
    // });
    // this.getStateList();
  }

  storeAlloted: any = [];
  getDistictAllotedToStaff() {
    this.share.showLoading('Loading');
    let obj:any = this.share.getListObj('distric', false, [], true);
    obj.staff_id=this.staff?.id
    this.storeAlloted=[]
    this.api.postapi('getDistictAllotedToStaff', obj).subscribe(
      (res: any) => {
        this.storeAlloted = res?.data;
      },
      (error: any) => {}
    );
  }
  buttonArray: any = [
    {
      name: 'Remove District',
      action: 'removeDistrict',
      image: './././assets/images/deleted.png',
    },
  ];
  stateName: any;
  async selectItem(list: any, itemName: any, table_name: any) {
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
        showAddButton:false,
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
  
  dismiss(){
    this.modalCtrl.dismiss()
  }

  async addDistrict() {
    const modal = await this.modalCtrl.create({
      component: SelectDistrictModelComponent,
      componentProps: {
     
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if (data?.district_id) {
      this.allotteDistrict(data?.district_id)
    }
    if (role === 'confirm') {
    }
  }
  allotteDistrict(district_id:any){
    let objVal={
      district_id:district_id,
      staff_id:this.staff?.id,
      actionByid:this.staffDetails?.id
    }
    let obj = {
        src: 'staff_district_record',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Added Successfully...');
       this.getDistictAllotedToStaff()

        //  this.dismiss();
      });
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

  search: any = {
    name: null,
  };
  updateItemIndex: any;
  actionEventCall(e: any) {
   if(e?.button?.name=='Remove District'){
this.removeAlert(e?.item)
   }
  }
async  removeAlert(district:any){
         
    const alert = await this.alertCtrl.create({
      header: "Remove District",
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
      this.removeDistrict(district);
    }
  
  }
  removeDistrict(district:any){
    let objVal={
      isDeleted:true
    }
      let obj = {
        src: 'staff_district_record',
        data: objVal,
        id: district?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Removed Successfully...');
     this.getDistictAllotedToStaff()
      });

  }
  districtWiseFIlter() {
    this.districtList = this.districtListSrc.filter(
      (f: any) => f.state_id == this.selectedState
    );
  }

}
