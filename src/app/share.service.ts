import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ShareService {
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
  spinner: any;
  async showLoading(message:any,duration:any=5000) {
    this.spinner = await this.loadingCtrl.create({
      message: message,
      duration: duration,
    });

    this.spinner.present();
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
        if(userde?.staff_role=='DIGITAL'){
        this.router.navigate(['/digital/customer-management'])
        }
        else if(userde?.staff_role=='OPERATIONAL'){
          this.router.navigate(['/operational/new-arrivals'])
        }
        else if(userde?.staff_role=='PURCHASE'){
          this.router.navigate(['/purchase-management/new-findings'])
        }
       
        else if(userde?.staff_role=='SUPER_ADMIN' || userde?.staff_role=='ADMIN'){
          this.router.navigate(['/admin-block/digital-analyse'])
        }
        else if(userde?.staff_role=='FRANCHISE'){
          this.router.navigate(['/franchise-management/new-tractor'])
        }
        else if(userde?.staff_role=='REPAIR'){
          this.router.navigate(['/repair-management/job-dashboard'])
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
