import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/share.service';
import { AddSalesManagerComponent } from './add-sales-manager/add-sales-manager.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { AssigningStaffComponent } from 'src/app/shared-components/assigning-staff/assigning-staff.component';
@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.scss'],
})
export class StoreManagementComponent  implements OnInit {

  constructor(
    private router: Router,
    public share: ShareService,
    public activatedRoute: ActivatedRoute,
    private modalCTrl: ModalController,
    private api:ApiService,
    private commonMethod:CommonMethodService
  ) {}
listColorClass='firstColor'
  ngOnInit() {}
  srcPage: any;
  staffDetails: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
   
    this.getStaffList()
 this.getStaffListTM()
  }
    headerDisplayArray = [
    { name: 'Add Staff', icon: 'add-circle-outline' },
    { name: 'Back To Dashboard', icon: 'arrow-back-outline' },

  ];
   actionEventHeader(e: any) {
    if (e?.name == 'Add Staff') {
      this.addStaff();
    } else if (e?.name == 'Back To Dashboard') {
      this.backToDashboard();
    }
  
  }
    async addStaff(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AddSalesManagerComponent,
      componentProps: {
        editedData:staff
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
if(data){
  this.getStaffList()
}
    if (role === 'confirm') {
    }
  }
  staffList: any = [];
  selectedBrand: any;
  getStaffList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_role='SALES_HEAD'
    setTimeout(() => {
      this.api.postapi('getStaffListRoleWise', obj).subscribe(
        (res: any) => {
          this.staffList = res?.data;
     this.share.spinner.dismiss('active_one')
        },
        (error: any) => {}
      );
    }, 0);
  }
    buttonArray: any = [

      {
      name: 'Edit Staff',
      action: 'Edit_Staff',
      image: './././assets/images/edit.png',
    },
          {
      name: 'Assign TL',
      action: 'assign_tl',
      image: './././assets/images/assign.png',
    },
    
  ];
    keyList: any = [
    { key: 'User ID', value: 'userId', type: 'INPUT' },
    { key: 'Contact', value: 'contact1', type: 'INPUT' },
 
    { key: 'Alloted State', value: 'stateName', type: 'INPUT' },
  ];
  staffListTM:any=[]
    getStaffListTM(loader: any = false) {
 
    //if(loader){

    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_role='TERRITORY_MANAGER'
    setTimeout(() => {
      this.api.postapi('getStaffListRoleWise', obj).subscribe(
        (res: any) => {
          this.staffListTM = res?.data;
  
        },
        (error: any) => {}
      );
    }, 0);
  }
  async assignTL(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AssigningStaffComponent,
      cssClass: 'midium-model',
      componentProps: {
        headStaff:staff,
        staffListAll:this.staffListTM
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
if(data){
  this.getStaffList()
}
    if (role === 'confirm') {
    }
  }

    async actionEventCall(e: any) {
      if(e?.button?.name=='Edit Staff'){
this.addStaff(e?.staff)
      }
          if(e?.button?.name=='Assign TL'){
this.assignTL(e?.staff)
      }
 
 
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
}
