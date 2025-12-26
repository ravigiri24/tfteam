import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-add-tractor-docs-status-rto',
  templateUrl: './add-tractor-docs-status-rto.component.html',
  styleUrls: ['./add-tractor-docs-status-rto.component.scss'],
})
export class AddTractorDocsStatusRtoComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private fb: FormBuilder, private share: ShareService, private api: ApiService) { }
  dismiss() {
    this.modalCtrl.dismiss()
  }
  form: FormGroup;
  @Input() listColorClass: any = "secondColor"
  title = 'Note'
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.initialize()
  }
  editData: any
  staffDetails: any
  tractorDetails: any
  type: any
  note_id: any = null
  initialize() {
    this.form = this.fb.group({
      note: new FormControl(this.editData?.note || null, [Validators.required]),

      note_id: new FormControl(this.editData?.note_id || this.note_id, []),
      type: new FormControl(this.editData?.type || this.type, [Validators.required]),
      tractor_id: new FormControl(this.editData?.tractor_id || this.tractorDetails?.id, [
        Validators.required,
      ]),

      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),


    });

  }
  save() {

    if (this.form.valid) {

      let obj = {
        src: 'rto_notes_list',
        data: this.form.value,
      };
      this.share.showLoading('Adding ...')
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        console.log("res", res);

        this.share.spinner?.dismiss('active_four');
        this.share.presentToast("Added Successfully...")

        this.modalCtrl.dismiss({ row: res?.rowData })

      });
    } else {
      this.share.presentToast("Please Add Note")
    }
  }
  update() {

    if (this.form.valid) {

      let obj = {
        src: 'rto_notes_list',
        data: this.form.value,
        id: this.editData?.id
      };
      this.share.showLoading('updating ...')
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        console.log("res", res);

        this.share.spinner?.dismiss('active_four');
        this.share.presentToast("Updated Successfully...")

        this.modalCtrl.dismiss({ row: res?.rowData })

      });
    } else {
      this.share.presentToast("Please Add Note")
    }
  }
}
