import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-start-repair-dialog',
  templateUrl: './start-repair-dialog.component.html',
  styleUrls: ['./start-repair-dialog.component.scss'],
})
export class StartRepairDialogComponent  implements OnInit {
  updateTranctorStatus:any=true
  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.initialize(this.tractorDetails);
  }
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  form: FormGroup;
  initialize(data: any = null) {
    if(this.updateTranctorStatus){
    this.form = this.fb.group({
  
      tractor_status: new FormControl(null),
       
      isLive: new FormControl(true, [
        Validators.required,
      ]),
      isDraft: new FormControl(true, [
        Validators.required,
      ]),
    });
  }else{
    this.form = this.fb.group({
      repairing_start_date: new FormControl(
        data?.repairing_start_date || null,
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
  updateItem() {
    if (this.form.valid) {
      let obj = {
        src: 'tractor',
        data: this.form.value,
        id: this.tractorDetails?.id,
      };
      this.share.showLoading('Updating Details...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
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
