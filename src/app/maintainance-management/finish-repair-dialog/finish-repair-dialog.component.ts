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
  selector: 'app-finish-repair-dialog',
  templateUrl: './finish-repair-dialog.component.html',
  styleUrls: ['./finish-repair-dialog.component.scss'],
})
export class FinishRepairDialogComponent  implements OnInit {
  tractorDetails: any;
  updateTranctorStatus:any=true
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
      repairing_end_date: new FormControl(
        data?.repairing_end_date || null,
        [Validators.required]
      ),

     
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
      repairing_end_date: new FormControl(
        data?.repairing_end_date || null,
        [Validators.required]
      ),

     
      tractor_status: new FormControl(null),
       
      isLive: new FormControl(true, [
        Validators.required,
      ]),
   
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
