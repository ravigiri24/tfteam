import { Component, EventEmitter, OnInit,ViewChild,Output,Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent  implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor(private fb:FormBuilder,private share:ShareService,private api:ApiService,private loadingCtrl: LoadingController,private toastController: ToastController) { }
@Output() closeModal=new EventEmitter()
@Input() editData:any=null
  ngOnInit() {
    console.log("editData",this.editData);
    
    this.initialize()
  }
  name:any
  message:any
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  customerForm: FormGroup;
  staffDetails:any
  initialize(){
    let staffDetails:any=this.share.get_staff()
console.log("staffDetails",staffDetails);
this.staffDetails=JSON.parse(staffDetails)
this.customerForm=this.fb.group({
  name:new FormControl(this.editData?.name||null,[Validators.required]),
  mobileNo:new FormControl(this.editData?.mobileNo||null,[Validators.required]),
  customerType:new FormControl(this.editData?.customerType||"DIGITAL",[Validators.required]),
  storeId:new FormControl(this.staffDetails?.storeId,[Validators.required]),
  actionByid:new FormControl(this.staffDetails?.id,[Validators.required]),
  id:new FormControl(this.editData?.id||null,[Validators.required]),
  remark:new FormControl(null,[]),
})
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  loader=false
  saveForm(){
    let obj=this.customerForm.value
console.log(this.customerForm.value);

this.showLoading()
this.api.postapi('addCustomer',obj).subscribe((res:any)=>{
  this.spinner?.dismiss()
  this.presentToast(res?.msg)
  
  this.loader=false
  this.closeModal.emit()
})
  }

  spinner:any
  async showLoading() {
    this.spinner = await this.loadingCtrl.create({
     message: 'Saving...',
     duration: 20000,
   
   });

   this.spinner.present();
 
 }
 async presentToast(msg:any) {
   const toast = await this.toastController.create({
     message: msg,
     duration: 1500,
     position: 'bottom',
   });

   await toast.present();
 }
}
