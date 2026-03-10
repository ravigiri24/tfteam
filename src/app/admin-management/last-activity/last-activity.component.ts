import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';

@Component({
  selector: 'app-last-activity',
  templateUrl: './last-activity.component.html',
  styleUrls: ['./last-activity.component.scss'],
})
export class LastActivityComponent  implements OnInit {


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
    // { name: 'Add Staff', icon: 'add-circle-outline' },
    { name: 'Back To Dashboard', icon: 'arrow-back-outline' },

  ];
   actionEventHeader(e: any) {
    if (e?.name == 'Back To Dashboard') {
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

obj.staff_role='SALES_HEAD'
    setTimeout(() => {
      this.api.postapi('getStaffActivityList', obj).subscribe(
        (res: any) => {
          this.staffList = res?.data;
     this.share.spinner.dismiss('active_one')
        },
        (error: any) => {}
      );
    }, 0);
  }
    buttonArray: any = [

    
  ];
    keyList: any = [
    { key: 'User ID', value: 'userId', type: 'INPUT' },
    { key: 'Contact', value: 'contact1', type: 'INPUT' },
    { key: 'Last Active', value: 'last_activity', type: 'DATE' },
 
    { key: 'Alloted State', value: 'stateName', type: 'INPUT' },
  ];




    async actionEventCall(e: any) {
//       if(e?.button?.name=='Edit Staff'){
// this.addStaff(e?.staff)
//       }
//           if(e?.button?.name=='Assign TL'){
// this.assignTL(e?.staff)
//       }
 
 
  }
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }

}
