import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  staffDetails: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.initialize(this.staffDetails);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
  wareHouseLocationList: any = [];

  formWarehouse: FormGroup;
  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      oldPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required]),
      confirmNewPassword: new FormControl(null, [Validators.required]),
    });

    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  checkOldPassord() {
    if (
      this.form.value.oldPassword.trim() == this.staffDetails?.password.trim()
    ) {
      return true;
    } else {
      return false;
    }
  }
  confirmPassword() {
    if (
      this.form.value?.newPassword.trim() ==
       this.form.value?.confirmNewPassword.trim()
    ) {
      return true;
    } else {
      return false;
    }
  }
  updatePassword() {
    if (this.form.valid) {
      if (this.checkOldPassord() && this.confirmPassword()) {
        let dataStaff: any = {
          password: this.form.value.newPassword.trim(),
        };
        let obj = {
          src: 'staffdetails',
          data: dataStaff,
          id: this.staffDetails?.id,
        };
        this.share.showLoading('Updating Password...');
        this.api.postapi('updateOpp', obj).subscribe((res: any) => {
              this.share.spinner.dismiss()
              this.modalCtrl.dismiss(true)

        });
      } else {
        if (!this.checkOldPassord()) {
          this.share.presentToast('Old Password Not Matched');
        }
        if (!this.confirmPassword()) {
          this.share.presentToast(
            'New Password Not Matched With Confirm New Password'
          );
        }
      }
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
