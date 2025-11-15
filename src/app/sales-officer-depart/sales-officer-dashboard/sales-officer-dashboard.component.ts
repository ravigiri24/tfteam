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
  date:any
  ionViewWillEnter() {
         let selectedStore: any = this.share.get_sales_officer_store();
            this.selectedStore = JSON.parse(selectedStore);
        var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.date = yyyy + '-' + mm + '-' + dd;
   this.getFollowList()
   this.getVisitorList()
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
    goTofollowup(){
    this.router.navigate(['/sales-officer/follow-up-management','/sales-officer/so-dashbord']);
  }
    goToVisiting(){
    this.router.navigate(['/sales-officer/visiting-management','/sales-officer/so-dashbord']);
  }
  
  customerListVisiting:any=[]
    getVisitorList(){
   
    let obj: any = this.share.getListObj('customerdetails', false, [], true);
    obj.date = this.date;
    obj.storeId=this.selectedStore?.store_id
  //  this.share.showLoading('Loading...')
      this.customerListVisiting=[]
    this.api.postapi('getVisitorList', obj).subscribe(
      (res:any) => {
        //this.followUpList = res.data;
        res?.data?.forEach((f:any)=>{
     this.customerListVisiting.push(f?.customerDetails)
        })
   
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        // console.log("followUpList",this.followUpList);
        // this.share?.spinner?.dismiss('active_six')
        // this.loader = false;
      },
      (error:any) => {
   
      }
    );
  }
  customerListFollowuplist:any=[]
    getFollowList() {

    let obj: any = this.share.getListObj('customerdetails', false, [], true);
    obj.date = this.date;
    obj.storeId =this.selectedStore?.store_id
    this.share.showLoading('Loading...');
    this.customerListFollowuplist = [];
    this.api.postapi('getFollowupList', obj).subscribe(
      (res: any) => {
     
        res?.data?.forEach((f: any) => {
          this.customerListFollowuplist.push(f?.customerDetails);
        });
      
      },
      (error: any) => {
  
      }
    );
  }
}
