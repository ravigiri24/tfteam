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
    this.warehouselocation()
    this.getAllotedStoresToStaff();
 
  }

  storeList:any
    warehouselocation() {
    this.storeList = [];
    let obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.storeList = res?.data;
    
      },
      (error: any) => {}
    );
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
  getAllotedStoresToStaff() {
    this.share.showLoading('Loading');
    let obj:any = this.share.getStaffObj();
    obj.staff_id=this.staff?.id
    this.storeAlloted=[]
    this.api.postapi('getAllotedStoresToStaff', obj).subscribe(
      (res: any) => {
        this.storeAlloted = res?.data;
        this.share.spinner.dismiss()
      },
      (error: any) => {}
    );
  }
  buttonArray: any = [
    {
      name: 'Remove Store',
      action: 'removeStore',
      image: './././assets/images/deleted.png',
    },
     
  ];
  stateName: any;
  async selectItem(list: any) {
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
             cssClass: 'midium-model',
      componentProps: {
        list: list,
        itemName: 'Store',
 
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

      if (data) {
        let checkIn=this.storeAlloted.find((f:any)=>f?.store_id==data?.id)
        if(!checkIn){
       this.allotteStore(data)
        }else{
this.share.presentToast("Already Assigned")
        }
 
        // this.selectedState = data?.id;
        // this.stateName = data?.name;
        // this.getDistrictList();
      }
    
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  
  dismiss(){
    this.modalCtrl.dismiss()
  }


  allotteStore(store:any){
    let objVal={
      store_id:store?.id,
      staff_id:this.staff?.id,
      actionByid:this.staffDetails?.id
    }
    let obj = {
        src: 'assigned_store_id',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();

        this.share.presentToast('Assigned Successfully...');
       this.getAllotedStoresToStaff()

        //  this.dismiss();
      });
  }
  selectedState: any;

 


  search: any = {
    name: null,
  };
  updateItemIndex: any;
  actionEventCall(e: any) {
   if(e?.button?.name=='Remove Store'){
this.removeAlert(e?.item)
   }
  
  }
async  removeAlert(store:any){
         
    const alert = await this.alertCtrl.create({
      header: "Remove Store",
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
      this.removeStore(store);
    }
  
  }
  removeStore(district:any){
    let objVal={
      isDeleted:true
    }
      let obj = {
        src: 'assigned_store_id',
        data: objVal,
        id: district?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Removed Successfully...');
     this.getAllotedStoresToStaff()
      });

  }
      headerDisplayArray = [
     { name: 'Assign Store', icon: 'add-circle-outline' },
    { name: 'Dismiss', icon: 'close' },

  ];
   actionEventHeader(e: any) {
    if (e?.name == 'Dismiss') {
      this.dismiss();
    } 
  else if(e?.name == 'Assign Store'){
    this.selectItem(this.storeList)
  }
  }

}
