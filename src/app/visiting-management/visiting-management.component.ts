import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ViewCustomerDataComponent } from '../customer-management/view-customer-data/view-customer-data.component';
@Component({
  selector: 'app-visiting-management',
  templateUrl: './visiting-management.component.html',
  styleUrls: ['./visiting-management.component.scss'],
})
export class VisitingManagementComponent  implements OnInit {
  @ViewChild(IonModal) modalFollow: IonModal;
  constructor(private api:ApiService,private share:ShareService,private fb:FormBuilder,private modalController:ModalController) {

  
   }
   date:any
   staffDetails:any
   ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.date = yyyy + '-' + mm + '-' + dd;

    this.getVisitorList();
  }
   async viewCustomer(customer:any=null){
    const modal = await this.modalController.create({
      component: ViewCustomerDataComponent,
      componentProps: {
        customerSelected: customer,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
  customerSelected:any
  showRemark=true
  cancel() {
    this.modalFollow.dismiss(null, 'cancel');
   
  }
  show=false
  addReview(cus: any, editIndex: any){
    this.customerSelected=cus?.customerDetails
    this.showRemark=false
    setTimeout(() => {
     this.showRemark=true
    }, 0);
    this.initializeNextDate(cus?.customerDetails)
      document.getElementById('open-modal-follow')?.click();
  
 }
 followLoader:any=false
 nextFollowupDate() {
   if (this.nextScheduleForm.valid) {
     this.followLoader = true;
     let obj = {
       src: 'customer_lead_chats',
       data: this.nextScheduleForm.value,
     };
     this.share.showLoading('Scheduling ...')
     this.api.postapi('addOpp', obj).subscribe((res:any) => {
       this.followLoader = false;
       this.share.spinner?.dismiss('active_six');
     this.share.presentToast("Scheduled Successfully...")
       this.nextScheduleForm.controls['status'].reset();
   
     });
   }
 }
 message:any
 onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<string>>;
  if (ev.detail.role === 'confirm') {
    this.message = `Hello, ${ev.detail.data}!`;
  }
}
 nextScheduleForm:FormGroup
 initializeNextDate(customer:any) {
  this.nextScheduleForm = this.fb.group({
    next_lead_date: new FormControl( null, [Validators.required]),
    customer_id: new FormControl(customer?.id || null, [
      Validators.required,
    ]),
    chat_type: new FormControl("FOLLOW_UP_DATE", [
      Validators.required,
    ]),
    employeId: new FormControl(this.staffDetails?.staffCode || null, [
      Validators.required,
    ]),
  });

  // if(data){
  //   this.form.addControl(
  //     'id',
  //     new FormControl(data?.id || null, [Validators.required])
  //   );
  // }
}
followUpList:any=[]
  ngOnInit() {}
  refreshList(){
    this.getVisitorList()
    setTimeout(() => {
      this.cancel()
    }, 0);


  }
  search:any
  showData=true
  loader=false
  getVisitorList(){
    this.loader = true;
    let obj: any = this.share.getListObj('customerdetails', false, [], true);
    obj.date = this.date;
    obj.storeId=this.staffDetails?.storeId
    this.share.showLoading('Loading...')
    this.api.postapi('getVisitorList', obj).subscribe(
      (res:any) => {
        this.followUpList = res.data;
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        // this.followUpList?.forEach((f:any)=>{
        //   this.followUpList.push(f)
        // })
        console.log("followUpList",this.followUpList);
        this.share?.spinner?.dismiss('active_six')
        this.loader = false;
      },
      (error:any) => {
        this.loader = false;
      }
    );
  }

}
