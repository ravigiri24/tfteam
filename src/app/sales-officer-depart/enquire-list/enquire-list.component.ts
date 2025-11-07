import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { GlobalFilterTractorComponent } from 'src/app/shared-components/global-filter-tractor/global-filter-tractor.component';
import { CommonMethodService } from 'src/app/common-method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEnqiuryComponent } from '../add-enqiury/add-enqiury.component';
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
      await this.commonMethod.actionEventCall(e, { optionsUploadButtonArray: [] })
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
  ];
  getEnquirList() {
    this.enquireList = [];
    let obj:any = this.share.getStaffObj();
    obj.storeId=3

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
srcPage:any
    ionViewWillEnter() {
      this.activatedRoute.params.subscribe((params: any) => {
      this.selectedItem = params?.type;
    this.srcPage= params?.srcPage;
    });
    this.getEnquirList()
  }
  optionActionEvent(e:any){
console.log("optionActionEvent",e);

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
