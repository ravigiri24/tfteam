import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';


import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-forward-to-transport',
  templateUrl: './forward-to-transport.component.html',
  styleUrls: ['./forward-to-transport.component.scss'],
})
export class ForwardToTransportComponent  implements OnInit {
updateTranctorStatus=true
   constructor(
     private modalControl: ModalController,
     private alertCtrl: AlertController,
     private share: ShareService,
     private api:ApiService,
         private fb: FormBuilder,
   ) {}

 
  ngOnInit() {
    this.initialize()
  }
dismiss(){
this.modalControl.dismiss()
}
tractor:any
updateItem(){
   if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractor?.id,
      };
      this.share.showLoading('Forwarding to Transport...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.share.presentToast('Forwarded Successfully...');
        this.modalControl.dismiss({isForworded:true});
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
}
form:FormGroup

  initialize(data: any = null) {
    if(this.updateTranctorStatus){
    this.form = this.fb.group({
      forwordToTransportDate: new FormControl(
        data?.forwordToTransportDate || null,
        [Validators.required]
      ),


      tractor_status: new FormControl("AT_TRANSPORT", [
        Validators.required,
      ]),
    });
  }else{
    this.form = this.fb.group({
      forwordToTransportDate: new FormControl(
        data?.forwordToTransportDate || null,
        [Validators.required]
      ),


    });
  }

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  
}
