import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { ViewModelsComponent } from '../add-enquiry/view-models/view-models.component';
@Component({
  selector: 'app-view-enquiry',
  templateUrl: './view-enquiry.component.html',
  styleUrls: ['./view-enquiry.component.scss'],
})
export class ViewEnquiryComponent implements OnInit {
  @Input() listColorClass = 'sixColor';
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) { }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  enquiry: any
  modelList: any = []
  ngOnInit() {
    this.modelList = JSON.parse(this.enquiry?.modal_ids)
    if (this.modelList?.length) {
      let modelList: any = this.modelList
      modelList?.forEach((model: any) => {
        this.getAvailaiblility(model, false)
      })

    }
  }
  getAvailaiblility(model: any, isAdd: any = true) {

    let obj: any = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Checking Availaibility');
    obj.model_id = model?.id
    this.api.postapi('getModelAvailaibility', obj).subscribe(
      (res: any) => {
        let availaibility = res?.data

        let valueOf = this.modelList;
        let findModel = valueOf?.findIndex((fn: any) => fn.id == model.id)
        valueOf[findModel].availaibility = availaibility
        // this.form.controls['modal_ids'].setValue(valueOf)


        this.share?.spinner?.dismiss();
      },
      (error: any) => { }
    );
  }
  async viewModel(model: any) {
    let avaialiableList = model?.availaibility
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: ViewModelsComponent,
      componentProps: {
        modelList: avaialiableList,

      },
      cssClass: 'midium-model',
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

}
