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
  selector: 'app-cost-prediction',
  templateUrl: './cost-prediction.component.html',
  styleUrls: ['./cost-prediction.component.scss'],
})
export class CostPredictionComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.initialize();
    this.getBrandList();
    this.createYearArray();
    this.getValuation();
  }
  yearArray: any = [];
  createYearArray() {
    this.yearArray = [];
    let date = new Date();
    let getyear = date.getFullYear();
    let tillyear = Number(getyear) - 41;
    for (let index = getyear; index > tillyear; index--) {
      this.yearArray.push(index);
    }
  }
  getPriceEstimate() {
    if(this.form.valid){
    this.share.showLoading("Checking")
    let date = new Date();
    let currentYear = date.getFullYear();
    let previousYear=currentYear-1
    let yearForPrice=this.form.controls['year'].value
    let currentPrice=this.form.controls['current_price'].value
    let lastYearPrice=Number(currentPrice)*0.8
    let deduction=0.95
    for (let index = previousYear-1; index >= yearForPrice; index--) {
    
      lastYearPrice=lastYearPrice*deduction
      lastYearPrice=Number(lastYearPrice.toFixed(0))
     console.log("index",index,lastYearPrice,deduction);
     deduction= Number((Number(deduction)-0.05).toFixed(2))
    }
this.form.controls['selectedyearPrice'].setValue(lastYearPrice)

setTimeout(() => {
  this.share.spinner.dismiss()
}, 300);
    }else{
      this.share.presentToast("Please fill all Fields")
    }
  }
  staffDetails: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    let date = new Date();
    let currentYear = date.getFullYear();
    this.form = this.fb.group({
      brand_id: new FormControl(this.data?.brand_id || null, [
        Validators.required,
      ]),
      model_id: new FormControl(this.data?.model_id || null, [
        Validators.required,
      ]),
      current_price: new FormControl(this.data?.current_price || null, [
        Validators.required,
      ]),
      year: new FormControl(currentYear-1 || null, [Validators.required]),
      selectedyearPrice: new FormControl(this.data?.selectedyearPrice || null, []),
    });
  }
  brandList: any = [];
  data: any;
  form: FormGroup;

  valuationList: any = [];
  getValuation() {
    let obj = this.share.getListObj('getValuation', false, [], false);
    this.api.postapi('getValuation', obj).subscribe(
      (res: any) => {
        this.valuationList = res?.data;
        console.log('valuationList', this.valuationList);
      },
      (error: any) => {}
    );
  }
  getBrandList() {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('brand', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.brandList = res.data;
        this.brandList = this.brandList.reverse();
        if (!this.data) {
          this.form.controls['brand_id'].setValue(this.brandList[0]?.id);
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
        if (!this.data) {
          this.getModelsbyBrand();
        } else {
          this.getModelsbyBrand(false);
        }
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
  }
  resetPrice(){
    this.form.controls['selectedyearPrice'].setValue(null);
    let getModel=this.valuationList.find((f:any)=>f.model_id==this.form.controls['model_id'].value)
    if(getModel){
      this.form.controls['current_price'].setValue(getModel?.model_current_price||0)
    }else{
      this.form.controls['current_price'].setValue(0)
    }
  }
  getModelsbyBrand(setValue: any = true) {
  
    if (setValue) {
      this.form.controls['model_id'].setValue(null);
    }
    this.modelList = this.modelListAll.filter(
      (f: any) => f.brandID == this.form.controls['brand_id']?.value
    );
    if (this.modelList?.length && setValue) {
      this.form.controls['model_id'].setValue(this.modelList[0]?.id);
    }
    this.resetPrice()
  }
}
