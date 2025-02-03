import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-new-findings',
  templateUrl: './add-new-findings.component.html',
  styleUrls: ['./add-new-findings.component.scss'],
})
export class AddNewFindingsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController
  ) {}

  ngOnInit() {
    this.initialize();
    this.getBrandList();
  }
  brandList: any = [];
  isShowOnly=false
  getBrandList() {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('brand', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.brandList = res.data;
        this.brandList = this.brandList.reverse();
        if(!this.data){
        this.newFindingForms.controls['brand_id'].setValue(
          this.brandList[0]?.id
        );
      }
        this.getModelList();
        //  this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  modelList: any = [];
  modelListAll: any = [];
  getModelList() {
    this.modelList = [];
    let obj = this.share.getListObj('model', false, [], false);
    // this.share.showLoading('Loading...')
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.modelListAll = res.data;
        if(!this.data){
        this.getModelsbyBrand();
        }else{
          this.getModelsbyBrand(false);
        }
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }
  getModelsbyBrand(setValue:any=true) {
    if(setValue){
    this.newFindingForms.controls['model_id'].setValue(null);
    }
    this.modelList = this.modelListAll.filter(
      (f: any) => f.brandID == this.newFindingForms.controls['brand_id']?.value
    );
    if (this.modelList?.length && setValue) {
      this.newFindingForms.controls['model_id'].setValue(this.modelList[0]?.id);
    }
  }
  dismiss() {
    this.modalCntrol.dismiss();
  }
  saveForm() {
 
    if (this.newFindingForms.valid) {
      let obj = {
        src: 'new_findings',
        data: this.newFindingForms.value,
      };
      this.share.showLoading('Saving');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Saved Successfully');
        this.share.spinner.dismiss();
        this.newFindingForms.reset();
        return this.modalCntrol.dismiss(null, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.share.presentToast('Please Fill required fields');
      this.newFindingForms.markAllAsTouched();
    }
  }
  updateForm() {
    if (this.newFindingForms.valid) {
      let obj = {
        src: 'new_findings',
        data: this.newFindingForms.value,
        id:this.data?.id
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Updated Successfully');
        this.share.spinner.dismiss();
        this.newFindingForms.reset();
        return this.modalCntrol.dismiss(null, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.share.presentToast('Please Fill required fields');
      this.newFindingForms.markAllAsTouched();
    }
  }
  newFindingForms: FormGroup;

  staffDetails: any;
  data: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.newFindingForms = this.fb.group({
      brand_id: new FormControl(this.data?.brand_id || null, [
        Validators.required,
      ]),
      model_id: new FormControl(this.data?.model_id || null, [
        Validators.required,
      ]),
      expected_price: new FormControl(this.data?.expected_price || 'DIGITAL', [
        Validators.required,
      ]),
      location: new FormControl(this.data?.location, [Validators.required]),

      dealerName: new FormControl(this.data?.dealerName, [Validators.required]),
      contactNumber: new FormControl(this.data?.contactNumber, []),

      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
      yearOfManufactoring: new FormControl(this.data?.yearOfManufactoring, []),
      registractionNo: new FormControl(this.data?.registractionNo, []),
      hours: new FormControl(this.data?.hours, []),
      id: new FormControl(this.data?.id || null),
      remark: new FormControl(this.data?.remark, []),
    });
  }
}
