import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/share.service';
import { AddSalesOfficerComponent } from './add-sales-officer/add-sales-officer.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { AssinedStoresComponent } from './assined-stores/assined-stores.component';
import { AddDistrictInStaffComponent } from 'src/app/admin-management/lead-employee-mgmt/add-district-in-staff/add-district-in-staff.component';
@Component({
  selector: 'app-sales-officer',
  templateUrl: './sales-officer.component.html',
  styleUrls: ['./sales-officer.component.scss'],
})
export class SalesOfficerComponent  implements OnInit {


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

  staffList: any = [];
  selectedBrand: any;
  getStaffList(loader: any = false) {

    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_role='SALES_OFFICER'
obj.state_id=this.staffDetails?.allotedState
    setTimeout(() => {
      this.api.postapi('getStaffListRoleWiseStateWise', obj).subscribe(
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
      name: 'Assign Store',
      action: 'assign_store',
      image: './././assets/images/store.png',
    },
          {
      name: 'District-list-alloted',
      action: 'districtListAlloted',
      image: './././assets/images/location-pin.png',
    },
    
  ];
      async addDistrict(staff:any=null) {
      const modal = await this.modalCTrl.create({
        component: AddDistrictInStaffComponent,
        componentProps: {
          staff:staff
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
    keyList: any = [
    { key: 'User ID', value: 'userId', type: 'INPUT' },
    { key: 'Contact', value: 'contact1', type: 'INPUT' },
 
    { key: 'Posting', value: 'stateName', type: 'INPUT' },
  ];
  async addStaff(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AddSalesOfficerComponent,
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
    async assignStore(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AssinedStoresComponent,
      componentProps: {
      
        staff:staff
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
if(data){
  // this.getStaffList()
}
    if (role === 'confirm') {
    }
  }
   
    async actionEventCall(e: any) {
      if(e?.button?.name=='Edit Staff'){
this.addStaff(e?.staff)
      }
      if(e?.button?.name=='Assign Store'){
        this.assignStore(e?.staff)
      }
            if(e?.button?.name=='District-list-alloted'){
this.addDistrict(e?.staff)
      }
   
 
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }


}
