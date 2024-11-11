import { Component, OnInit,ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent  implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor(private share:ShareService,private api:ApiService,private loadingCtrl: LoadingController,private toastController: ToastController) { }
  staffDetails:any
  ngOnInit() {
    let staffDetails:any=this.share.get_staff()
    console.log("staffDetails",staffDetails);
    this.staffDetails=JSON.parse(staffDetails)
    console.log("CustomerManagementComponent");
    this.getCustomerList()
    
  }
  spinner:any
  async showLoading() {
    this.spinner = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 20000,
    });

    this.spinner.present();
  }
  customerList:any=[]
  showAddComp=true
  handleRefresh(e:any){
this.getCustomerList(e)
  }
  openEdit(cus:any){

document.getElementById('open-modal')?.click()
this.editData=cus
this.showAddComp=false
setTimeout(() => {
  this.showAddComp=true
}, 0);
  }
  getCustomerList(e:any=null) {
   this.showLoading()
    let obj:any = this.share.getListObj('customerdetails', false, [], true);
    obj.storeId=this.staffDetails?.storeId
    this.api.postapi('getCustomerListByStore', obj).subscribe(
      (res:any) => {
        this.customerList = res.data;
        this.spinner?.dismiss();
        e?.target?.complete();
    console.log("getCustomerListByStore",this.customerList);
    
      },
      (error:any) => {
    
      }
    );
  }
  editData:any
  dataClear(){
this.editData=null
this.showAddComp=false
setTimeout(() => {
  this.showAddComp=true
}, 0);
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  name:any
  message:any
  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  

}
