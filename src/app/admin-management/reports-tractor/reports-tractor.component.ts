import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { ViewSaleActivityLogComponent } from '../view-sale-activity-log/view-sale-activity-log.component';

@Component({
  selector: 'app-reports-tractor',
  templateUrl: './reports-tractor.component.html',
  styleUrls: ['./reports-tractor.component.scss'],
})
export class ReportsTractorComponent  implements OnInit {

  constructor(private router:Router,private share:ShareService,private api:ApiService,private modal:ModalController) { }

  ngOnInit() {}
  staffDetails:any
  jobData:any
  ionViewWillEnter() {
         let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
     let obj: any = this.share.getStaffObj();
    obj.staff_id = this.staffDetails?.id;
    this.api.checkNotification(obj);
   // this.getJobData();
  }
  getJobData() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      repair_center:this.staffDetails?.repair_center
 
    };
    this.share.showLoading('Loading');
    this.api.postapi('getJobTally', obj).subscribe(
      (res: any) => {
        this.jobData = res.data;
        console.log('jobData', this.jobData);

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  masterSheet(){
    this.router.navigate(['/admin-block/master-sheet-advance','/admin-block/reports-tractor'])
  }
    masterSheet_old(){
    this.router.navigate(['/admin-block/master-sheet','/admin-block/reports-tractor'])
  }
    workSheet(){
    this.router.navigate(['/admin-block/work-sheet','/admin-block/reports-tractor'])
  }
    unsoldReport(){
    this.router.navigate(['/admin-block/unsold-tractor-sheet','/admin-block/reports-tractor'])
  }
      unsoldReportSpecific(){
    this.router.navigate(['/admin-block/unsold-tractor-sheet-specific','/admin-block/reports-tractor'])
  }
    salesReport(){
    this.router.navigate(['/admin-block/sales-report','/admin-block/reports-tractor'])
  }
  
  leadManagement(){
       this.router.navigate(['/admin-block/lead-mgmt-employee','/admin-block/reports-tractor'])
    
  }
    storeManagement(){
       this.router.navigate(['/admin-block/sales-manager-list','/admin-block/reports-tractor'])
    
  }
     TeamManagement(){
       this.router.navigate(['/admin-block/team-manager-list','/admin-block/reports-tractor'])
    
  }
    goToTm() {
    this.router.navigate(['/admin-block/team-manager', '/admin-block/reports-tractor'])
  }
  goToSo(){
    this.router.navigate(['/admin-block/sales-officer','/admin-block/reports-tractor']);
  }
  lastSeen(){
        this.router.navigate(['/admin-block/last-activity','/admin-block/reports-tractor']);
  }
    transactionOverview(){
        this.router.navigate(['/admin-block/transaction-overview','/admin-block/reports-tractor']);
  }
  bufferList(){
    this.router.navigate(['/admin-block/buffer-list','/admin-block/reports-tractor']);
    
  }
    viewMaintainance(){
    this.router.navigate(['/admin-block/view-maintainance','/admin-block/reports-tractor']);
    
  }

viewFindingReports(){
  this.router.navigate(['/admin-block/finding-reports','/admin-block/reports-tractor']);
  
}
newFindingReports(){
  this.router.navigate(['/admin-block/new-finding-reports','/admin-block/reports-tractor']);
  
}
bookedTractorSheets(){
  this.router.navigate(['/admin-block/booked-tractor-sheets','/admin-block/reports-tractor']);
  
}
     async openSaleActiviyLog() {
      const modal = await this.modal.create({
        component: ViewSaleActivityLogComponent,
        cssClass: 'modal-xl',
        componentProps: {

        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
      }
    }
  
}
