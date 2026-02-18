import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { OpenNotificationAlertComponent } from './shared-components/open-notification-alert/open-notification-alert.component';
import { BehaviorSubject } from 'rxjs';
import { UpdateVersionAlertComponent } from './shared-components/update-version-alert/update-version-alert.component';
import { ShareService } from './share.service';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private modalCtrl:ModalController,
    private share:ShareService,
    private platform: Platform
  ) {
   
    // this.rootUrl = 'http://localhost/backend/RkApi/';
  }
  //frontendUrl="https://tractorfactory.in/#"

   rootUrl = 'http://localhost/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniyaAdmin/';
//rootUrl= "https://tractorfactory.in/admin/backend/tractorDuniyaAdmin/"
  private isOnlineSubject = new BehaviorSubject<boolean>(true);
  public isOnline$ = this.isOnlineSubject.asObservable();
  initializeApp() {
    this.isOnline$.subscribe(async isOnline => {
      if (!isOnline) {
        this.presentToast("No Internet Connection");
      } else {
         this.presentToast("Back Online");
      }
    });
  }
  postapi(x: any, object: any): any {
    //  let response:any= this.http.post(this.rootUrl + x, object).pipe(map((res) => res))
    //  if(response.msg=='Invalid Access'){
    //     this.router.navigate(['/login'])
    //  }else{
    //   return response
    //  }

       let getStaffDetail: any = this.get_staff();
    let getStaff: any = JSON.parse(getStaffDetail);

    this.accesCheck();
   object.staff_code_id=getStaff?.id
    return this.http.post(this.rootUrl + x, object).pipe(map((res) => res));
  }
   get_staff() {
    return localStorage.getItem('userDetails') || null;
  }
  version = '102';
  accesCheck() {
    let obj = {
      version: this.version,
    };
    this.postapiCheckAccess('checkAcessCheck', obj).subscribe((res: any) => {
      if (res?.status == false) {
        this.presentToast(res?.msg);
        this.updateVersionAlert()
     
        
      }
    });
  }
    async updateVersionAlert() {
      const modal = await this.modalCtrl.create({
        component: UpdateVersionAlertComponent,
        componentProps: {
         
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
    }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  postapiCheckAccess(x: any, object: any): any {
    return this.http.post(this.rootUrl + x, object).pipe(map((res) => res));
  }
  getapi(x: any): Observable<any> {
        this.accesCheck();
    return this.http.get<any>(this.rootUrl + x).pipe(map((res) => res));
  }


  // isOnline(): boolean {
  //   return this.isOnlineSubject.getValue();
  // }


  // Get current status directly
isOnline(): boolean {
  return this.isOnlineSubject.value;
}
checkNotification(obj:any){
       
  

      this.postapi('checkNotification', obj).subscribe(
        (res: any) => {
        if(res?.data>0){
          this.number_of_noti=res?.data
          this.alertNotification(res)
        }
        
        },
        (error: any) => {
        
        }
      );

  }
isModalOpen=false
 async alertNotification(res:any) {
    
      if(!this.isModalOpen){
      this.isModalOpen=true
      console.log("alertNotification",this.isModalOpen);
      const modal = await this.modalCtrl.create({
        component: OpenNotificationAlertComponent,
        breakpoints: [0, 0.4, 1],
      initialBreakpoint: 0.6,
        componentProps: {
     count:res?.data
        },
          //  cssClass: 'midium-model',
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
       this.isModalOpen=false
      if (role === 'confirm') {
      }
    }
    }
     getNotificationObj(title:any,description:any,selectedStore:any,type:any){
        let getStaffDetail: any = this.get_staff();
    let getStaff: any = JSON.parse(getStaffDetail);
    return {
        operate: getStaff?.staffCode,
        action_id:getStaff?.id,
      title:title,
      description:description,
      type:type,
      storeId:selectedStore
    }
  }
   genreteJobCardNotification(title:any,description:any,staffDetails:any) {
 
    let obj = this.getNotificationObj(
     title,
      description,
null,
      'Job Card'
    );
 this.postapi('generateJobCard', obj).subscribe((res: any) => {

    });
  }
  genreteEnquiry(title:any,description:any,selectedStore:any,staffDetails:any) {
 
    let obj = this.getNotificationObj(
     title,
      description,
      selectedStore?.store_id,
      'Enquiry'
    );

    this.postapi('generateEnquiry', obj).subscribe((res: any) => {
      this.generateNotifcationToAboveStaff(res?.rowData,staffDetails, selectedStore?.store_id);
    });
  }
  generateNotifcationToAboveStaff(noti: any,staffDetails:any,storeId:any) {
    let obj: any = {};
    obj.operate = this.share.getStaffObj()?.operate;

    obj.staff_id = staffDetails?.id;
    obj.noti_id = noti?.id;
    obj.storeId = storeId

    this.postapi('generateNotifcationToAboveStaff', obj).subscribe(
      (res: any) => {},
      (error: any) => {}
    );
  }
  number_of_noti:any=0
    markAsRead(staffDetails:any){
       let obj: any = this.share.getStaffObj();
   obj.staff_id=staffDetails?.id

       this.postapi('readNotification', obj).subscribe(
      (res: any) => {
    this.number_of_noti=0
      },
      (error: any) => {}
    );
  }
}
