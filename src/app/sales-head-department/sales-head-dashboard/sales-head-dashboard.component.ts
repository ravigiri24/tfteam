/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-sales-head-dashboard',
  templateUrl: './sales-head-dashboard.component.html',
  styleUrls: ['./sales-head-dashboard.component.scss'],
})
export class SalesHeadDashboardComponent  implements OnInit {


  constructor(private router: Router, private share: ShareService, private api: ApiService) { }

  ngOnInit() { }
  staffDetails: any

  @Input() listColorClass= 'firstColor';
  ionViewWillEnter() {

    this.getEnquiryTally();
  }
  enquiryData:any
  getEnquiryTally() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      storeId: 3,
      head_id:this.staffDetails?.id,
      state_id:this.staffDetails?.allotedState

    };
    this.share.showLoading('Loading');
    this.api.postapi('getAllotedTarriatryManager', obj).subscribe(
      (res: any) => {
        this.enquiryData = res.data;
        console.log('jobData', this.enquiryData);

        this.share.spinner.dismiss('active_one');
      },
      (error: any) => { }
    );
  }
  goToTm() {
    this.router.navigate(['/sales-head/team-manager', '/sales-head/sales-head-dashboard'])
  }
  goToSo(){
    this.router.navigate(['/sales-head/sales-officer','/sales-head/sales-head-dashboard']);
  }
}
