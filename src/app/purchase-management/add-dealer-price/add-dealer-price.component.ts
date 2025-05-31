import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder,Validators,FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-add-dealer-price',
  templateUrl: './add-dealer-price.component.html',
  styleUrls: ['./add-dealer-price.component.scss'],
})
export class AddDealerPriceComponent  implements OnInit {

  tractorDetails:any
  data:any
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.initialize(this.tractorDetails)
  }
  dismiss(){
this.modalCtrl.dismiss()
  }
  form:FormGroup

  initialize(data: any = null) {
    this.form = this.formBuilder.group({
   
   
      dealerPrice: new FormControl(data?.dealerPrice || null),
     
    });
    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
 
  savePrice() {
    if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractorDetails?.id,
      };
      this.share.showLoading('Updating Details...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
           this.tractorDetails.dealerPrice=this.form.value.dealerPrice
        this.share.spinner.dismiss();
        this.share.presentToast('Details Saved...');
        this.modalCtrl.dismiss(null, 'confirm');
     
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
