import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
    activeCurrent:any = null;
 showFooter=true
  constructor(private router:Router,    private loadingCtrl: LoadingController,private toastController: ToastController,private alertController: AlertController) { }
  set_staff_detail_session(data:any){
localStorage.setItem("userDetails",JSON.stringify(data))
  }
  clearSession(){
  //  localStorage.removeItem('currentGame');
     localStorage.clear();
 
  }
  showFooterAction(e:any){
this.showFooter=e
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'A Short Title Is Best',
      subHeader: 'A Sub Header Is Optional',
      message: 'A message should be a short, complete sentence.',
      buttons: ['Action'],
    });

    await alert.present();
  }

  get_staff(){
 return  localStorage.getItem("userDetails") || null
  }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  getListObj(src:any, isImage:any=false, images:any=[],all:any,keys:any=[]) {
    let getStaffDetail:any = this.get_staff();
    let getStaff:any = JSON.parse(getStaffDetail);
    let obj = {
      src: src,
      operate: getStaff?.staffCode,
      isImage: isImage,
      images: images,
      all:all,
      keys:keys
    };
    return obj
  }
  spinner = {
    dismiss: () => {
      this.activeCurrent='active_page active_six'
      setTimeout(() => {
            this.globalLoading=false
      }, 1000);
   
      // You can put your logic here (e.g., hiding loader UI)
    }}
  globalLoading=false
  async showLoading(message:any,duration:any=5000) {
 this.activeCurrent=null
    // this.spinner = await this.loadingCtrl.create({
    //   message: message,
    //   duration: duration,
    // });
    //    this.spinner.present();

       this.globalLoading=true
    setTimeout(() => {
      this.globalLoading=false
    }, duration);

 
  }
  getDataRowObj(src:any, isImage:any, images:any,rowCode:any){
    let staffDetails: any = this.get_staff();
    //console.log('staffDetails', staffDetails);
    let getStaff  = JSON.parse(staffDetails);
    let obj = {
      src: src,
      operate: getStaff?.staffCode,
      isImage: isImage,
      images: images,
      rowCode: rowCode,
     
    };
    return obj
  }
  checkLogin(){
    let user=this.get_staff()
    if(user){
      let userde=JSON.parse(user)
      if(userde){
        if(userde?.isMultiRole==0 || !userde?.isMultiRole){
          if(userde?.staff_role=='DIGITAL'){
            this.router.navigate(['/digital/customer-management'])
            }
            else if(userde?.staff_role=='OPERATIONAL'){
              this.router.navigate(['/operational/buffer-stock'])
            }
            else if(userde?.staff_role=='PURCHASE'){
              this.router.navigate(['/purchase-management/inventory-list'])
            }
           
            else if(userde?.staff_role=='SUPER_ADMIN' || userde?.staff_role=='ADMIN'){
              this.router.navigate(['/admin-block/reports-tractor'])
            }
            else if(userde?.staff_role=='FRANCHISE'){
              this.router.navigate(['/franchise-management/new-tractor'])
            }
            else if(userde?.staff_role=='REPAIR'){
              this.router.navigate(['/repair-management/job-dashboard'])
            }
            else if(userde?.staff_role=='HR'){
              this.router.navigate(['/hr-deparment/offer-letter'])
            }
               else if(userde?.staff_role=='FRANCHISE_OPERATIONS'){
              this.router.navigate(['/franchise-operation-deparment/ready-tractor-sales'])
            }
              else if(userde?.staff_role=='TRANSPORT'){
              this.router.navigate(['/transport-department/transport-management'])
            }
              else if(userde?.staff_role=='SELL_DEPARTMENT'){
              this.router.navigate(['/sell-department/live-tractor-list'])
            }
               else if(userde?.staff_role=='FINANCE_DEPARTMENT'){
              this.router.navigate(['/finance-department/sold-tractor'])
            }
                   else if(userde?.staff_role=='RTO_DEPARTMENT'){
              this.router.navigate(['/rto-department/rto-noc'])
            }
                else if(userde?.staff_role=='INVENTORY_RECEIVED'){
              this.router.navigate(['/inventory-receive-department/inven-received-list'])
            }
            
            
        }else{
          if(userde?.currentRole=='DIGITAL'){
            this.router.navigate(['/digital/customer-management'])
            }
            else if(userde?.currentRole=='OPERATIONAL'){
              this.router.navigate(['/operational/buffer-stock'])
            }
            else if(userde?.currentRole=='PURCHASE'){
              this.router.navigate(['/purchase-management/inventory-list'])
            }
           
            else if(userde?.currentRole=='SUPER_ADMIN' || userde?.currentRole=='ADMIN'){
              this.router.navigate(['/admin-block/reports-tractor'])
            }
            else if(userde?.currentRole=='FRANCHISE'){
              this.router.navigate(['/franchise-management/new-tractor'])
            }
            else if(userde?.currentRole=='REPAIR'){
              this.router.navigate(['/repair-management/job-dashboard'])
            }
            else if(userde?.currentRole=='HR'){
              this.router.navigate(['/hr-deparment/offer-letter'])
            }
            else if(userde?.currentRole=='FRANCHISE_OPERATIONS'){
              this.router.navigate(['/franchise-operation-deparment/ready-tractor-sales'])
            }
                else if(userde?.currentRole=='TRANSPORT'){
              this.router.navigate(['/transport-department/transport-management'])
            }
             else if(userde?.currentRole=='SELL_DEPARTMENT'){
              this.router.navigate(['/sell-department/live-tractor-list'])
            }
                 else if(userde?.currentRole=='FINANCE_DEPARTMENT'){
              this.router.navigate(['/finance-department/sold-tractor'])
            }
                else if(userde?.currentRole=='RTO_DEPARTMENT'){
              this.router.navigate(['/rto-department/rto-noc'])
            }
                  else if(userde?.currentRole=='INVENTORY_RECEIVED'){
              this.router.navigate(['/inventory-receive-department/inven-received-list'])
            }
            

        }
       
      }
    }else{
      this.router.navigate(['/login'])
    }
  }
  getDataId(src:any, isImage:any, images:any,id:any){
    let user = this.get_staff();
    let obj :any
   if(user){
      let userde=JSON.parse(user)
     obj = {
      src: src,
      operate: userde?.staffCode,
      isImage: isImage,
      images: images,
     
      id: id,
     
    };

  }
  return obj
}
}
