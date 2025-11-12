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
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { ViewModelsComponent } from '../add-enquiry/view-models/view-models.component';

@Component({
  selector: 'app-add-enqiury',
  templateUrl: './add-enqiury.component.html',
  styleUrls: ['./add-enqiury.component.scss'],
})
export class AddEnqiuryComponent implements OnInit {
  enquiry: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) { }
  staffDetails: any;
  @Input() listColorClass = 'sixColor';
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.getStateList();
    this.getModelList();
    this.initialize(this.enquiry);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;

  formWarehouse: FormGroup;
  initialize(data: any = null) {

    let store_id = 3
    let modelIds = []
    if (data) {
      if (JSON.parse(data?.modal_ids)?.length) {
        modelIds = JSON.parse(data?.modal_ids)
      } else {
        modelIds = []
      }
    }
    this.form = this.formBuilder.group({
      customerName: new FormControl(data?.customerName, [Validators.required]),
      mobileNo: new FormControl(data?.mobileNo, [Validators.required]),
      remark: new FormControl(data?.remark, []),
      modal_ids: new FormControl(modelIds || [], []),
      storeId: new FormControl(data?.storeId || store_id, [Validators.required]),
      actionByid: new FormControl(this?.staffDetails?.id, [Validators.required]),
      state_id: new FormControl(data?.state_id, [Validators.required]),
      city_id: new FormControl(data?.city_id, [Validators.required]),
      village: new FormControl(data?.village, [Validators.required]),
      strength: new FormControl(data?.strength, [Validators.required]),
      inStoke: new FormControl(data?.inStoke, [Validators.required]),
      other: new FormControl(data?.other, []),
    });

    console.log(' this.form', this.form);

    if (JSON.parse(data?.modal_ids)?.length) {
      let modelList: any = JSON.parse(data?.modal_ids)
      modelList?.forEach((model: any) => {
        this.getAvailaiblility(model, false)
      })

    }
    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  getModel() {
    let valueOf = this.form.controls['modal_ids']?.value || [];
    return valueOf
  }
  stateList: any = [];
  stateName: any;
  cityName: any;
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        if (this.enquiry?.state_id) {
          let find = this.stateList.find(
            (d: any) => d.id == this.form.controls['state_id'].value
          );
          if (find) {
            this.stateName = find?.name;
          }
        }
        this.getCityList();
      },
      (error: any) => { }
    );
  }

  modelList: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Loading...');
    this.api.postapi('getModelDataSanitized', obj).subscribe(
      (res: any) => {
        this.modelList = res.data;
        this.share?.spinner?.dismiss();
      },
      (error: any) => { }
    );
  }
  cityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        let find = this.cityList.find(
          (d: any) => d.id == this.form.controls['city_id'].value
        );
        if (find) {
          this.cityName = find?.name;
        }
        this.share.spinner.dismiss();
      },
      (error: any) => { }
    );
  }
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (itemName == 'City' && this.form.controls['state_id'].value) {
      if (this.cityListFilter?.length) {
        return true;
      } else {
        this.getCityListFilter();

        return true;
      }
    } else {
      return false;
    }
  }
  cityListFilter: any = [];
  getCityListFilter() {
    let getStateId = this.form?.controls['state_id']?.value;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    let openStatus = this.checkOpenCon(itemName);
    if (openStatus) {
      let otherObjects: any;
      if (itemName == 'City') {
        list = this.cityListFilter;
        otherObjects = {
          state_id: this.form.controls['state_id'].value,
        };
      }

      const modal = await this.modalCtrl.create({
        component: SelectWithSearchComponent,
        componentProps: {
          list: list,
          itemName: itemName,
          table_name: table_name,
          otherObjects: otherObjects,
          jsonKey: 'name',
          search: {
            name: null,
          },
        },
        cssClass: 'midium-model',
      });
      await modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (itemName == 'State') {
        if (data) {
          this.form.controls['state_id'].setValue(data?.id);
          this.form.controls['city_id'].setValue(null);
          this.cityName = null;
          this.stateName = data?.name;
          this.getCityListFilter();
        }
      } else if (itemName == 'City') {
        this.cityName = data?.name;
        this.form.controls['city_id'].setValue(data?.id);
      }
      console.log('role', role, data);

      if (role === 'confirm') {
      }
    } else {
      this.share.presentToast('Please Select State First');
    }
  }
  getModelObj(model: any) {
    return {
      id: model?.id,
      name: model?.name,
      brandName: model?.brandName,
      brandID: model?.brandID,
      availaibility: model?.availaibility
    };
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
  async selectModelList() {
    let otherObjects: any;

    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: this.modelList,
        itemName: "Model",
        table_name: 'model',
        otherObjects: otherObjects,
        jsonKey: 'name',
        search: {
          name: null,
        },
      },
      cssClass: 'midium-model',
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    console.log('role', role, data);
    if (data?.id) {
      let valueOf = this.form.controls['modal_ids'].value;
      let checkIn = valueOf?.find((f: any) => f.id == data?.id);
      if (!checkIn) {
        this.getAvailaiblility(data)


      } else {
        this.share.presentToast('Already In List');
      }
    }

    if (role === 'confirm') {
    }
  }
  getAvailaiblility(model: any, isAdd: any = true) {

    let obj: any = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Checking Availaibility');
    obj.model_id = model?.id
    this.api.postapi('getModelAvailaibility', obj).subscribe(
      (res: any) => {
        let availaibility = res?.data
        if (isAdd) {
          let valueOf = this.form.controls['modal_ids'].value;

          model.availaibility = availaibility
          valueOf.push(this.getModelObj(model));
          this.form.controls['modal_ids'].setValue(valueOf)
        } else {
          let valueOf = this.form.controls['modal_ids'].value;
          let findModel = valueOf?.findIndex((fn: any) => fn.id == model.id)
          valueOf[findModel].availaibility = availaibility
          this.form.controls['modal_ids'].setValue(valueOf)
        }

        this.share?.spinner?.dismiss();
      },
      (error: any) => { }
    );
  }
  save() {
    if (this.form.valid) {
      let obj: any = this.form.value
      obj.operate = this.share.getStaffObj()?.operate;
      this.share.showLoading('Saving...');

      this.api.postapi('saveEnquiry', obj).subscribe(
        (res: any) => {
          this.share.presentToast("Enquiry Generated Successfully")
          this.share.spinner.dismiss()
          this.modalCtrl.dismiss(true)
        },
        (error: any) => { }
      );
    } else {
      if (!this.form.valid) {
        this.share.presentToast("Please Fill Required Fields")
      }


    }
  }
  update() {
    if (this.form.valid) {
      let obj: any = this.form.value
      obj.operate = this.share.getStaffObj()?.operate;
      obj.id = this.enquiry?.id
      this.share.showLoading('Updating...');

      this.api.postapi('updateEnquiry', obj).subscribe(
        (res: any) => {
          this.share.presentToast("Enquiry Updated Successfully")
          this.share.spinner.dismiss()

          this.modalCtrl.dismiss(true)
        },
        (error: any) => { }
      );
    } else {
      if (!this.form.valid) {
        this.share.presentToast("Please Fill Required Fields")
      }


    }
  }
  deleteModel(model: any) {
    let valueOf = this.form.controls['modal_ids'].value;
    let findIn = valueOf?.findIndex((f: any) => f.id == model?.id)
    valueOf.splice(findIn, 1)
    this.form.controls['modal_ids'].setValue(valueOf)
  }
  updates() {

  }
}
