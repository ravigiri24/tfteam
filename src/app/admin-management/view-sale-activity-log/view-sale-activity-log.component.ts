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
import { ViewApprovalsComponent } from 'src/app/shared-components/notification-pop-up/view-approvals/view-approvals.component';
import { ViewEnquiryComponent } from 'src/app/sales-officer-depart/view-enquiry/view-enquiry.component';
@Component({
  selector: 'app-view-sale-activity-log',
  templateUrl: './view-sale-activity-log.component.html',
  styleUrls: ['./view-sale-activity-log.component.scss'],
})
export class ViewSaleActivityLogComponent  implements OnInit {


  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  listColorClass: any = 'firstColor';
  dismiss() {
    this.modalCtrl.dismiss();
  }
staffDetails:any
  ngOnInit() {
       let staffDetails: any = this.share.get_staff();
       this.staffDetails = JSON.parse(staffDetails);
       this.getNotification()
  }

  noti_list:any=[]
getNotification(){
      let obj: any = this.share.getStaffObj();
    
       obj.staff_id= this.staffDetails?.id
this.share.showLoading("Getting Logs")
      this.api.postapi('getSaleActivityLog', obj).subscribe(
        (res: any) => {
    this.noti_list=res?.data
 

        this.share.spinner.dismiss()
        },
        (error: any) => {
        
        }
      );

  }
    checkDetail(noti:any){
      if(noti?.worked_on_id){
        if(noti?.type=='APPROVAL'){
          this.openApprovalDetails(noti)
        }
           if(noti?.type=='Enquiry'){
          this.getEnquiryDeatailsById(noti)
        }
      }
    }
   async openApprovalDetails(noti:any){
      const modal = await this.modalCtrl.create({
            component: ViewApprovalsComponent,
            componentProps: {
      approval_id:noti?.worked_on_id
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          console.log('role', role);
      
          if (role === 'confirm') {
          }
    }
    getEnquiryDeatailsById(noti:any){
     let obj: any = this.share.getStaffObj()
      obj.requestBy = this.staffDetails?.id
  
      obj.enqiury_id = noti?.worked_on_id
    
      this.share.showLoading("Getting Data...")
      this.api.postapi('getEnquiryDetailByID', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        let enquireDetail=res?.data
        this.openEnquryDetails(enquireDetail)
  
      });
  
    }
    async openEnquryDetails(enquireDetail:any){
       const modal = await this.modalCtrl.create({
            component: ViewEnquiryComponent,
            componentProps: {
      enquiry:enquireDetail
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          console.log('role', role);
      
          if (role === 'confirm') {
          }
    }

}
