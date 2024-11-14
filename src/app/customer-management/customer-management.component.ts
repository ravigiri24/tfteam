import { Component, OnInit,ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent  implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor(private share:ShareService,private api:ApiService,private loadingCtrl: LoadingController,private toastController: ToastController) {
   
   }

   @ViewChild(IonContent) content: IonContent;

   scrollToTop() {
     this.content.scrollToTop(0);
   }
   showData=true
  staffDetails:any
  
  ionViewWillEnter(){
    this.customerList=[]
    this.showData=false
    setTimeout(() => {
      this.content.scrollToTop(0).then(()=>{
        this.getCustomerList()
      })
    }, 0);
 
    setTimeout(() => {
   
     
    }, 0);

  }
  ngOnInit() {
    let staffDetails:any=this.share.get_staff()
    console.log("staffDetails",staffDetails);
    this.staffDetails=JSON.parse(staffDetails)
    console.log("CustomerManagementComponent");
    //this.getCustomerList()
    
  }
  number=50
  onIonInfinite(ev:any){
console.log("onIonInfinite",ev);
// let number=50*(Number(ev?.eventPhase)+1)+50
// let indi=Number(this.customerList.length)+1

// for (let index = indi; index < number; index++) {
//  this.customerList.push(this.customerListOrg[index])
  
// }
if(this.showData){
let firstIndex=this.customerList.length
let lastIndex=firstIndex+51
this.getCustomerList(null,firstIndex,lastIndex,ev)
}else{
  setTimeout(() => {
    (ev as InfiniteScrollCustomEvent)?.target?.complete();
  }, 0);
}
// for (let index = firstIndex; index < lastIndex; index++) {
//   this.customerList.push(this.customerListOrg[index])
   
//  }

// setTimeout(() => {
//   (ev as InfiniteScrollCustomEvent).target.complete();
// }, 0);
  }
  search:any
  spinner:any
  async showLoading() {
    this.spinner = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 5000,
    });

    this.spinner.present();
  }
  customerList:any=[]
  showAddComp=true
  handleRefresh(e:any){
    // this.scrollToTop()
    // setTimeout(() => {
    //   this.getCustomerList(e,0,50,null,true)
    // }, 0);
    this.showData=false
    setTimeout(() => {
      this.content.scrollToTop(0).then(()=>{
        this.getCustomerList(e,0,50,null,true)
      })
    }, 0);

  }
  refreshList(){
    this.showData=false
    setTimeout(() => {
      this.content.scrollToTop(0).then(()=>{
        this.getCustomerList(null,0,50,null,true)
      })
    }, 0);
  }
  openEdit(cus:any){

document.getElementById('open-modal')?.click()
this.editData=cus
this.showAddComp=false
setTimeout(() => {
  this.showAddComp=true
}, 0);
  }
  digital:any=0
  online:any=0
  visitors:any=0
  customerListOrg:any=[]
  getCustomerList(e:any=null,firstIndex:any=0,lastIndex:any=50,loading:any=null,doBlank:any=false) {
 
    console.log(e,firstIndex,lastIndex,loading,doBlank);
    
   this.showLoading()
    let obj:any = this.share.getListObj('customerdetails', false, [], true);
    obj.storeId=this.staffDetails?.storeId
    obj.firstIndex=firstIndex
    obj.lastIndex=lastIndex
    setTimeout(() => {
      this.api.postapi('getCustomerListByStoreByIndex', obj).subscribe(
        (res:any) => {
          this.showData=true
          if(doBlank){
            this.customerList=[]
          }
       
          console.log("res",res,firstIndex,lastIndex);
          
          res?.data?.forEach((element:any) => {
            this.customerList.push(element)
          });
     
          console.log("  this.customerList",  this.customerList);
          // this.customerListOrg = JSON.parse(JSON.stringify(res.data));
          // this.customerList = JSON.parse(JSON.stringify(res.data))
          // this.customerList.splice(50);
      
          
          // this.digital=this.customerList.filter((f:any)=>f?.customerType=='DIGITAL')?.length
          // this.online=this.customerList.filter((f:any)=>f?.customerType=='ONLINE')?.length
          // this.visitors=this.customerList.filter((f:any)=>f?.customerType=='VISITORS')?.length
          this.spinner?.dismiss();
          e?.target?.complete();
          setTimeout(() => {
            (loading as InfiniteScrollCustomEvent)?.target?.complete();
          }, 0);
   
      console.log("getCustomerListByStore",this.customerList);
      
        },
        (error:any) => {
      
        }
      );
    }, 0);
  
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
