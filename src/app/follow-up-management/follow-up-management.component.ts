import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
@Component({
  selector: 'app-follow-up-management',
  templateUrl: './follow-up-management.component.html',
  styleUrls: ['./follow-up-management.component.scss'],
})
export class FollowUpManagementComponent  implements OnInit {
  @ViewChild(IonModal) modalFollow: IonModal;
  constructor(private api:ApiService,private share:ShareService,private fb:FormBuilder) {

  
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

    this.getFollowList();
  }
  customerSelected:any
  showRemark=true
  cancel() {
    this.modalFollow.dismiss(null, 'cancel');
   
  }
  show=false
  addReview(cus: any, editIndex: any){
    this.customerSelected=cus
    this.showRemark=false
    setTimeout(() => {
     this.showRemark=true
    }, 0);
    this.initializeNextDate(cus)
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
       this.share.spinner?.dismiss();
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
this.getFollowList()
  }
  search:any
  showData=true
  loader=false
  getFollowList(){
    this.loader = true;
    let obj: any = this.share.getListObj('customerdetails', false, [], true);
    obj.date = this.date;
    this.share.showLoading('Loading...')
    this.api.postapi('getFollowupList', obj).subscribe(
      (res:any) => {
        this.followUpList = res.data;
        this.followUpList?.forEach((f:any)=>{
          this.followUpList.push(f)
        })
        this.followUpList?.forEach((f:any)=>{
          this.followUpList.push(f)
        })
        console.log("followUpList",this.followUpList);
        this.share?.spinner?.dismiss()
        this.loader = false;
      },
      (error:any) => {
        this.loader = false;
      }
    );
  }
}
