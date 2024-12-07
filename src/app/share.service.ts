import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private router:Router,    private loadingCtrl: LoadingController,private toastController: ToastController,) { }
  set_staff_detail_session(data:any){
localStorage.setItem("userDetails",JSON.stringify(data))
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
  async showLoading(message:any) {
    this.spinner = await this.loadingCtrl.create({
      message: message,
      duration: 5000,
    });

    this.spinner.present();
  }
  checkLogin(){
    let user=this.get_staff()
    if(user){
      let userde=JSON.parse(user)
      if(userde){
        this.router.navigate(['/customer-management'])
      }
    }else{
      this.router.navigate(['/login'])
    }
  }
}
