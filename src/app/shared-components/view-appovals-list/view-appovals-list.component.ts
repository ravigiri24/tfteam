import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-view-appovals-list',
  templateUrl: './view-appovals-list.component.html',
  styleUrls: ['./view-appovals-list.component.scss'],
})
export class ViewAppovalsListComponent  implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    public share: ShareService,
    private api: ApiService
  ) {}
  listColorClass: any = 'firstColor';
  dismiss() {

    this.modalCtrl.dismiss();
  }
  staffDetails:any
selectedType:any='PENDING'
  ngOnInit() {
        let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
this.getingApprovalList()
  }

  approvalList:any=[]
  selectedStore:any
    getingApprovalList() {

let obj:any= this.share.getStaffObj()
obj.requestBy=this.staffDetails?.id
obj.storeId=[this.selectedStore]
obj.type=this.selectedType
this.approvalList=[]
this.share.showLoading("Getting Data...")
      this.api.postapi('getApporvalList',obj ).subscribe((res: any) => {
        this.share.spinner.dismiss();
this.approvalList=res?.data
     
      });
  


    
  }
  optionActionEventCall(){

  }
  dumyData:any= [
        {
          id: "3",
          tractor_id: "197",
          requestBy: "16",
          actionByid: "16",
          approvePrice: "512000",
          createdOn: "2025-11-26 17:49:03",
          updatedOn: null,
          isDeleted: "0",
          isActive: "1",
          remark: "kar do",
          expectedDateOfSale: "2025-12-04",
          isApproved: "0",
          apporveRemark: null,
          approveactionDate: null,
            approvedBy: null,
            storeId: "6",
            actionTaken: "0",
            tractor_name: "Mahindra yuvo 475 DI",
            approvalGivenBy: null
        },
        {
            id: "2",
            tractor_id: "269",
            requestBy: "16",
            actionByid: "16",
            approvePrice: "412000",
            createdOn: "2025-11-26 17:48:34",
            updatedOn: null,
            isDeleted: "0",
            isActive: "1",
            remark: "LENA H JALDI",
            expectedDateOfSale: "2025-11-29",
            isApproved: "1",
            apporveRemark: "lelo",
            approveactionDate: "2025-11-27",
            approvedBy: "5",
            storeId: "6",
            actionTaken: "1",
            tractor_name: "EICHER 485",
            approvalGivenBy: "Abhinav"
        }
    ]
}
