import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ShareService } from '../share.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  constructor(private formBuilder:FormBuilder,private api:ApiService,private share:ShareService,private router:Router,private loadingCtrl: LoadingController,private toastController: ToastController) { }
loginForm:FormGroup
  ngOnInit() {
    this.initiateForm()
    this.share.showFooter=false
  }
  ionViewWillEnter() {
 this.initiateForm()
  }
  spinner:any
  async showLoading() {
     this.spinner = await this.loadingCtrl.create({
      message: 'Login...',
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
  initiateForm() {
    this.loginForm = this.formBuilder.group({
      userId: [null, Validators.required],
      password: [null, Validators.required],
   
    });
  }
  loading:any
  checkAuthentication(){
 
    console.log("checkAuthentication",this.loginForm.value);
    if(this.loginForm?.valid){
      this.showLoading()
    this.api.postapi("authentication",this.loginForm.value).subscribe((res:any)=>{
      if (res.status) {
        this.loading = false;
        this.spinner?.dismiss()
        this.presentToast('Login Successfully...')
        this.share.set_staff_detail_session(res.data);
        this.share.showFooter=true
      //  this.router.navigate(['/digital/customer-management']);
        this.share.checkLogin()
      } else {
        this.presentToast('Invalid Credential...')
        this.spinner?.dismiss()
        this.loading = false;
        //this.showNotification('snackbar-danger', res.msg, 'bottom', 'center');
      }
    })
  }else{
this.presentToast( 'Please Fill All Fields(*)')
  }
  }
}
