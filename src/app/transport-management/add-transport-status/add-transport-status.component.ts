import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-add-transport-status',
  templateUrl: './add-transport-status.component.html',
  styleUrls: ['./add-transport-status.component.scss'],
})
export class AddTransportStatusComponent implements OnInit {
  tractor_id: any;
  constructor(
    private modalCtrl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.initialize()
    this.getList()
  }
  chatHistory: any = [];
  dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
  getList() {
    let obj: any = this.share.getListObj('transportstatus', false, [], true);
    obj.tractor_id = this.tractor_id;
    this.share.showLoading('Loading...');
    this.api.postapi('getChats', obj).subscribe(
      (res: any) => {
        this.chatHistory = res.data;
        this.chatHistory.reverse();
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }
  loader = false;
  onSave() {
    if (this.form.valid) {
      this.loader = true;
      let obj = {
        src: 'transportstatus',
        data: this.form.value,
      };
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.loader = false;

        this.share.presentToast('Saved Successfully...');
        this.form.controls['status'].reset();
        this.getList();
        // this.chatHistory.push(this.form.value);
      });
    }
  }
  form: FormGroup;
  staffDetails: any;
  initialize() {
    this.form = this.formBuilder.group({
      status: new FormControl(null, [Validators.required]),
      tractor_id: new FormControl(this.tractor_id || null, [
        Validators.required,
      ]),
      employeId: new FormControl(this.staffDetails?.staffCode || null, [
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
}
