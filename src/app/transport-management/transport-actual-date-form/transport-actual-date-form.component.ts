import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-transport-actual-date-form',
  templateUrl: './transport-actual-date-form.component.html',
  styleUrls: ['./transport-actual-date-form.component.scss'],
})
export class TransportActualDateFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController
  ) {}
  tractorDetails: any;
  ngOnInit() {
    this.initialize(this.tractorDetails);
  }
  form: FormGroup;
  initialize(data: any = null) {
    this.form = this.fb.group({
      actualReleaseDate: new FormControl(data?.actualReleaseDate || null, [
        Validators.required,
      ]),
    });
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
        this.tractorDetails.actualReleaseDate= this.form.value?.actualReleaseDate
        this.share.presentToast('Details Saved...');
        this.modalCtrl.dismiss({isActioned:true});
      });
    } else {
      this.share.presentToast('Please fill all details');

      this.form.markAllAsTouched();
    }
  }
}
