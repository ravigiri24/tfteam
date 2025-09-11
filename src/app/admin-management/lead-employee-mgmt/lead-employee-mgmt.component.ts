import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/share.service';
import { AddLeadStaffComponent } from './add-lead-staff/add-lead-staff.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { AddDistrictInStaffComponent } from './add-district-in-staff/add-district-in-staff.component';
@Component({
  selector: 'app-lead-employee-mgmt',
  templateUrl: './lead-employee-mgmt.component.html',
  styleUrls: ['./lead-employee-mgmt.component.scss'],
})
export class LeadEmployeeMgmtComponent implements OnInit {
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
  staffList: any = [];
  selectedBrand: any;
  getStaffList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);


    setTimeout(() => {
      this.api.postapi('getStaffList', obj).subscribe(
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
      name: 'District-list-alloted',
      action: 'districtListAlloted',
      image: './././assets/images/location-pin.png',
    },
  ];
  
  async addStaff(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AddLeadStaffComponent,
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
    async actionEventCall(e: any) {
      if(e?.button?.name=='Edit Staff'){
this.addStaff(e?.staff)
      }
          if(e?.button?.name=='District-list-alloted'){
this.addDistrict(e?.staff)
      }
 
 
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
}
