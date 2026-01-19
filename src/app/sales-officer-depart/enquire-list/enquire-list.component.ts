import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

import { CommonMethodService } from 'src/app/common-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEnqiuryComponent } from '../add-enqiury/add-enqiury.component';
import { ReviewPageComponent } from 'src/app/customer-management/review-page/review-page.component';
@Component({
  selector: 'app-enquire-list',
  templateUrl: './enquire-list.component.html',
  styleUrls: ['./enquire-list.component.scss'],
})
export class EnquireListComponent  implements OnInit {
  constructor(
    public share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private commonMethod:CommonMethodService,
    private activatedRoute:ActivatedRoute,
    private router:Router
  ) {}
  listColorClass = 'sixColor';
  ngOnInit() {


  }
enquireList:any=[]
  headerDisplayArray = [
    { name: 'Add New', icon: 'add-circle-outline' },

    { name: 'Back', icon: 'arrow-back-outline' },
  ];
    actionEventHeader(e: any) {
    if (e?.name == 'Back') {
        this.router.navigate([this.srcPage])
    } else if (e?.name == 'Add New') {
      this.addEnquiry(null);
    }
  }
   async actionEventCall(e: any) {
    if(e?.button?.name=='Customer Remark' || e?.button?.name=='Customer View'){
     let obj= {button:e?.button,index:e?.index,customer:{id:e?.customer?.customer_id,name:e?.customer?.customerName},}
      await this.commonMethod.actionEventCall(obj, { optionsUploadButtonArray: [] })
    }else{
           await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })
    }
     
      if(this.commonMethod.reloadMethod){
        this.getEnquirList()
      }

  }
    buttonArray: any = [

    {
      name: 'Edit Enquiry',
      action: 'edit_enquiry',
      image: './././assets/images/edit.png',
    },
    {
      name: 'View Enquiry',
      action: 'customer_view',
      image: './././assets/images/visual.png',
    },
       {
      name: 'Close Enquiry',
      action: 'closed_enquiry',
      image: './././assets/images/summary.png',
    },
       {
      name: 'Customer Remark',
      action: 'customer_review',
      image: './././assets/images/comments.png',
    },
        {
      name: 'Customer View',
      action: 'customer_view',
      image: './././assets/images/data.png',
    },
  ];
  getEnquirList() {
    this.enquireList = [];
    let obj:any = this.share.getStaffObj();
    obj.storeId=[this.selectedStore?.store_id]
    if(this.selectedItem=='OPEN_ENQUIRE'){
    obj.enquiryType=true
    }else if(this.selectedItem=='CLOSED_ENQUIRE'){
  obj.enquiryType=false
    }else{
       obj.enquiryType=true
    }
  
    

    this.share.showLoading('Loading...');
    this.api.postapi('get_customers_enquire', obj).subscribe(
      (res: any) => {
        this.enquireList = res.data;
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }
     async addEnquiry(enquiry: any=null) {
      const modal = await this.modalCtrl.create({
        component: AddEnqiuryComponent,
  
        cssClass: 'midium-model',
        componentProps: {
          enquiry: enquiry,
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
 this.getEnquirList()
        //this.callListApi();
      }
    }
     async addRemark(customer: any = null) {
        const modal = await this.modalCtrl.create({
          component: ReviewPageComponent,
          componentProps: {
            customer: customer,
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
      }
srcPage:any
selectedStore:any
    ionViewWillEnter() {
      this.activatedRoute.params.subscribe((params: any) => {
      this.selectedItem = params?.type;
    this.srcPage= params?.srcPage;
    });
         let selectedStore: any = this.share.get_sales_officer_store();
            this.selectedStore = JSON.parse(selectedStore);
    this.getEnquirList()
  }
  optionActionEvent(e:any){
console.log("optionActionEvent",e);
this.selectedItem=e
this.getEnquirList()
  }
 selectedItem="OPEN_ENQUIRE"
  optionsArray:any=[
    {
      id:"OPEN_ENQUIRE",name:"Open Enquire"

    },
        {
      id:"CLOSED_ENQUIRE",name:"Closed Enquire"

    }
  ]
}
