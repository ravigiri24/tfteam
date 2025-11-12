import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-assigning-staff',
  templateUrl: './assigning-staff.component.html',
  styleUrls: ['./assigning-staff.component.scss'],
})
export class AssigningStaffComponent  implements OnInit {

    constructor(
    private router: Router,
    public share: ShareService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private modalCtrl: ModalController,
    private alertCtrl:AlertController
  ) {}
staffList:any=[]
listColorClass='firstColor'
    headerDisplayArray = [
    { name: 'Add Staff', icon: 'add-circle-outline' },
    { name: 'Back To Dashboard', icon: 'close' },

  ];
  ngOnInit() {
       let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);
   // this.getStaffList()
    this.getAssignedList()
   
  }
  searchHeading:any='TM'
   async actionEventCall(e: any) {
      if(e?.button?.name=='Remove Tractor'){
this.deleteItem(e?.staff)
      }

   
 
  }
    async deleteItem(staff: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove TL',
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
      this.removeStaff(staff);
    }
  }
    removeStaff(staff: any) {
    let objData: any = {
      isDeleted: true,
    };
    let obj = {
      src: 'assigningn_staff_record',
      data: objData,
      id: staff?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss('active_one');
  
      this.share.presentToast('Removed Successfully...');
     this.getAssignedList()
      //  this.dismiss();
    });
  }
  headerHeading='Assign TM'
  headStaff:any
    staffListAll: any = [];
  selectedBrand: any;
  staffDetails: any;

    async selectItem(list: any, itemName: any=null, table_name: any=null) {
 

      const modal = await this.modalCtrl.create({
        component: SelectWithSearchComponent,
        componentProps: {
          list: list,
          itemName: this.searchHeading,
          table_name: table_name,
     showAddButton:false,
          jsonKey: 'name',
          search: {
            name: null,
          },
        },
        cssClass: 'midium-model',
      });
      await modal.present();

      const { data, role } = await modal.onWillDismiss();

        if (data) {
          // this.form.controls['allotedState'].setValue(data?.id);
 
          // this.stateName = data?.name;
          let checkIn=this.staffList.find((f:any)=>f?.staff_id==data?.id)
          if(!checkIn){
      this.assignTL(data)
          }else{
this.share.presentToast("Already Assigned")
          }
 
        }
      
      console.log('role', role, data);

      if (role === 'confirm') {
      }
    
  }
  assignTL(staff:any){
       let objVal={
      actionByid:this.staffDetails?.id,
      staff_id:staff?.id,
      reportToStaffId:this.headStaff?.id
    }
    let obj = {
        src: 'assigningn_staff_record',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss('active_one');

        this.share.presentToast('Added Successfully...');
       this.getAssignedList()

        //  this.dismiss();
      });

  }
  getAssignedList(){
      this.share.showLoading('Loading...');
    // }
    let obj: any = this.share.getListObj('staffList', false, [], true);

obj.staff_id=this.headStaff?.id
    setTimeout(() => {
      this.api.postapi('getAssignedStaff', obj).subscribe(
        (res: any) => {
          this.staffList = res?.data;
     this.share.spinner.dismiss('active_one')
        },
        (error: any) => {}
      );
    }, 0);
  }
      keyList: any = [
    { key: 'User ID', value: 'userId', type: 'INPUT' },
    { key: 'Contact', value: 'contact1', type: 'INPUT' },
 
    { key: 'Posting', value: 'stateName', type: 'INPUT' },
  ];
     actionEventHeader(e: any) {
    if (e?.name == 'Add Staff') {
      this.selectItem(this.staffListAll,this.headerHeading);
    } else if (e?.name == 'Back To Dashboard') {
      this.dismiss();
    }
  
  }
  addStaff(){

  }
  dismiss(){
    this.modalCtrl.dismiss()
  }
      buttonArray: any = [

        {
      name: 'Remove Tractor',
      action: 'removetractor',
      image: './././assets/images/deleted.png',
    },
    
  ];

}
