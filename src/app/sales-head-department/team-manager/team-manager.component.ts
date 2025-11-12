import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/share.service';
import { AddTeamManagerComponent } from 'src/app/shared-components/team-manager/add-team-manager/add-team-manager.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { AssigningStaffComponent } from 'src/app/shared-components/assigning-staff/assigning-staff.component';
@Component({
  selector: 'app-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrls: ['./team-manager.component.scss'],
})
export class TeamManagerComponent  implements OnInit {

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
    this.getStaffListSO()
  }
    headerDisplayArray = [
    // { name: 'Add Staff', icon: 'add-circle-outline' },
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
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
    //if(loader){
    this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_role='TERRITORY_MANAGER'
obj.staff_id=this.staffDetails?.id
    setTimeout(() => {
      this.api.postapi('getAllotedStaffRoleWise', obj).subscribe(
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
      name: 'Assign SO',
      action: 'assign_so',
      image: './././assets/images/assign.png',
    },
    
  ];
    keyList: any = [
    { key: 'User ID', value: 'userId', type: 'INPUT' },
    { key: 'Contact', value: 'contact1', type: 'INPUT' },
 
    { key: 'Posting', value: 'stateName', type: 'INPUT' },
  ];
  staffListSO:any=[]
      getStaffListSO(loader: any = false) {
   
      //if(loader){
  
      // }
      let obj: any = this.share.getListObj('staffList', false, [], true);
  
  obj.staff_role='SALES_OFFICER'
  obj.state_id=this.staffDetails?.allotedState
      setTimeout(() => {
        this.api.postapi('getStaffListRoleWiseStateWise', obj).subscribe(
          (res: any) => {
            this.staffListSO = res?.data;
    
          },
          (error: any) => {}
        );
      }, 0);
    }
    async assignTL(staff:any=null) {
      const modal = await this.modalCTrl.create({
        component: AssigningStaffComponent,
        componentProps: {
          headStaff:staff,
          staffListAll:this.staffListSO,
          headerHeading:"Assign Sales Officer",
          searchHeading:"Sales Officer"
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
  async addStaff(staff:any=null) {
    const modal = await this.modalCTrl.create({
      component: AddTeamManagerComponent,
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
   
    async actionEventCall(e: any) {
      if(e?.button?.name=='Edit Staff'){
this.addStaff(e?.staff)
      }
            if(e?.button?.name=='Assign SO'){
this.assignTL(e?.staff)
      }
 
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }

}
