import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { UpdateVersionAlertComponent } from './shared-components/update-version-alert/update-version-alert.component';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private modalCtrl:ModalController
  ) {
    // this.rootUrl = 'http://localhost/backend/RkApi/';
  }
  //frontendUrl="https://tractorfactory.in/#"

  //rootUrl = 'http://localhost/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniyaAdmin/';
rootUrl= "https://tractorfactory.in/admin/backend/tractorDuniyaAdmin/"

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
}
