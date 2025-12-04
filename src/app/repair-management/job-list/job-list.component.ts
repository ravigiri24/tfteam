import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { RepairDashboardComponent } from '../repair-dashboard/repair-dashboard.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  constructor(
    private share: ShareService,
    private api: ApiService,
    private router: Router,
    private modalControl: ModalController,
    private alertCtrl:AlertController,
    private commonMethod:CommonMethodService
  ) {}
  search: any = { tfCode: '', regNumber: '' };
  ngOnInit() {}
  jobList: any = [];
  refreshList() {
    this.getJobList();
  }
   async actionEventCall(e: any) {
    if(e?.button?.name!='Delete Job'){
  await  this.commonMethod.actionEventCall(e,{optionsUploadButtonArray:[]})
    }else{
this.deleteItem(e?.tractor)
    }

    
  if(this.commonMethod.reloadMethod){
    this.refreshList()
  }
    console.log('actionEventCall', e);
    // if (e?.button?.name == 'IS Noc') {
    //   this.nocUpdate(e?.tractor);
    // }
    // if (e?.button?.name == 'View Details') {
    //   this.viewDetails(e?.tractor);
    // }
    
  }
  async deleteItem(job: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Job',
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
      this.deleteJobApi(job);
    }
  }
 geneateTFCode(job:any){

 }
  deleteJobApi(job: any) {
    let obj = {
      src: 'repairing_record',
      data: { isDeleted: true },
      id: job?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss('active_two');

      this.share.presentToast('Deleted Successfully...');
      this.getJobList()
   
    });
  }
  editobj= {
      name: 'Edit JOb',
      action: 'edit-job',
      image: './././assets/images/edit.png',
    }
  deleteObj=   {
      name: 'Delete Job',
      action: 'deleteJob',
      image: './././assets/images/deleted.png',
    }
    dashboardObj={
      name: 'View Job Detail',
      action: 'viewJob',
      image: './././assets/images/layout.png',
    }
    buttonArray: any = [
 {
      name: 'View Job Detail',
      action: 'viewJob',
      image: './././assets/images/layout.png',
    }
  ];
  listColorClass='secondColor'
  async openRepairDashboard(job:any) {
    this.router.navigate([
      '/repair-management/repair-dashboard',
      job?.id,
      '/repair-management/job-list',
    ]);


  }
  keyList: any = [
    { key: 'Modal Name', value: 'modalName', type: 'INPUT' },
        { key: 'TF Code', value: 'tfCode', type: 'INPUT' },
    { key: 'Engine Number', value: 'engineNumber', type: 'INPUT' },
    // { key: 'Staus', value: 'tractor_status', type: 'INPUT' },
    { key: 'Registration Number', value: 'regNumber', type: 'INPUT' },
    { key: 'Chasis Number', value: 'chassisNumber', type: 'INPUT' },
    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
  ionViewWillEnter() {
    this.jobList = [];
    this.jobType=false
    this.getJobList();
  }
  staffDetails: any;
  jobType=false
  getJobList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
  this.buttonArray=[]
    let obj = {
      operate: this.staffDetails?.staffCode,
      isCompleted: this.jobType,
      repair_center:this.staffDetails?.repair_center
    };
    this.share.showLoading('Loading');
         this.jobList=[]
    this.api.postapi('jobList', obj).subscribe(
      (res: any) => {

        this.jobList = res.data;
        console.log('jobList', this.jobList);
       this.jobList?.forEach((job:any)=>{
job.modalName=job?.modelDetails?.name
       })
       if(this.jobType){
        this.buttonArray.push(this.dashboardObj)
       
       }else{
        this.buttonArray.unshift(this.dashboardObj)
        this.buttonArray.unshift(this.deleteObj)
        this.buttonArray.unshift(this.editobj)
       }
        this.share.spinner.dismiss('active_two');
      },
      (error: any) => {}
    );
  }
    async searchTractor() {
      const modal = await this.modalControl.create({
        component: SearchTractorWithTfCodeComponent,
        componentProps: {
          buttonArray: this.buttonArray,
          listColorClass: this.listColorClass,
          keyList: this.keyList,
          searchFilter: this.search,
          searchKey: 'registractionNo',
          obj: { optionsUploadButtonArray: [] }
        },
             cssClass: 'midium-model',
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
      }
    }
  openEdit(job: any) {
    this.router.navigate([
      '/repair-management/update-job',
      job?.id,
      '/repair-management/job-list',
    ]);
  }
  openDashboard() {}
}
