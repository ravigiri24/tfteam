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
  selector: 'app-start-transport-dialog',
  templateUrl: './start-transport-dialog.component.html',
  styleUrls: ['./start-transport-dialog.component.scss'],
})
export class StartTransportDialogComponent implements OnInit {
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
    this.form = this.fb.group({
      transport_start_date: new FormControl(
        data?.transport_start_date || null,
        [Validators.required]
      ),

      transport_src_place: new FormControl(data?.transport_src_place || null, [
        Validators.required,
      ]),
      tractor_status: new FormControl("AT_TRANSPORT", [
        Validators.required,
      ]),
    });

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
