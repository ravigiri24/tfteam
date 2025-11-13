/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-sales-officer-dashboard',
  templateUrl: './sales-officer-dashboard.component.html',
  styleUrls: ['./sales-officer-dashboard.component.scss'],
})
export class SalesOfficerDashboardComponent  implements OnInit {


  constructor(private router: Router, private share: ShareService, private api: ApiService) { }

  ngOnInit() { }
  staffDetails: any

  @Input() listColorClass= 'firstColor';
  ionViewWillEnter() {
     let selectedStore: any = this.share.get_sales_officer_store();
            this.selectedStore = JSON.parse(selectedStore);
    this.getEnquiryTally();
   
  }
  enquiryData:any
  selectedStore:any
  getEnquiryTally() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      storeId: this.selectedStore?.store_id,

    };
    this.share.showLoading('Loading');
    this.api.postapi('getEnquiryTally', obj).subscribe(
      (res: any) => {
        this.enquiryData = res.data;
        console.log('jobData', this.enquiryData);

        this.share.spinner.dismiss('active_one');
      },
      (error: any) => { }
    );
  }
  createJob() {
    this.router.navigate(['/repair-management/create-job', '/repair-management/job-dashboard'])
  }
  goToEnquire(type:any){
    this.router.navigate(['/sales-officer/enquire-list',type,'/sales-officer/so-dashbord']);
  }
}
