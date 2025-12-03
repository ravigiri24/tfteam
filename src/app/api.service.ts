import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { UpdateVersionAlertComponent } from './shared-components/update-version-alert/update-version-alert.component';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private modalCtrl:ModalController,
        private network: Network,
    private platform: Platform
  ) {
        this.platform.ready().then(() => {
      this.startNetworkWatcher();
    });
    // this.rootUrl = 'http://localhost/backend/RkApi/';
  }
  //frontendUrl="https://tractorfactory.in/#"

  rootUrl = 'http://localhost/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniyaAdmin/';
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
    initializeNetworkEvents() {
    // Current status
    const status = this.network.type !== this.network.Connection.NONE;
    this.isOnlineSubject.next(status);

    // Listen for disconnect
    this.network.onDisconnect().subscribe(() => {
      console.log('Network disconnected!');
      this.isOnlineSubject.next(false);
    });

    // Listen for reconnect
    this.network.onConnect().subscribe(() => {
      console.log('Network connected!');
      this.isOnlineSubject.next(true);
    });
  }

  // isOnline(): boolean {
  //   return this.isOnlineSubject.getValue();
  // }
    startNetworkWatcher() {

  //  if (this.platform.is('cordova')) {
      // ------------ DEVICE MODE ----------------
      console.log("Cordova mode - using Network plugin");

      const initialStatus = this.network.type !== this.network.Connection.NONE;
      this.isOnlineSubject.next(initialStatus);

      // Internet disconnected
      this.network.onDisconnect().subscribe(() => {
        console.log("CORDOVA: No internet");
        this.isOnlineSubject.next(false);
      });

      // Internet connected
      this.network.onConnect().subscribe(() => {
        console.log("CORDOVA: Back online");
        this.isOnlineSubject.next(true);
      });

    // } else {
  
    //   console.log("Browser mode - using window.online");

    //   this.isOnlineSubject.next(navigator.onLine);

    //   window.addEventListener("offline", () => {
    //     console.log("BROWSER: No internet");
    //     this.isOnlineSubject.next(false);
    //   });

    //   window.addEventListener("online", () => {
    //     console.log("BROWSER: Back online");
    //     this.isOnlineSubject.next(true);
    //   });
    // }
  }

  // Get current status directly
isOnline(): boolean {
  return this.isOnlineSubject.value;
}

}
