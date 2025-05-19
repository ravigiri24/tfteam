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
import { ActivatedRoute, Router } from '@angular/router';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';

@Component({
  selector: 'app-sold-status-entry',
  templateUrl: './sold-status-entry.component.html',
  styleUrls: ['./sold-status-entry.component.scss'],
})
export class SoldStatusEntryComponent  implements OnInit {

  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController,
    private router: Router,
    private activatedRoute:ActivatedRoute
) {}

  ngOnInit() {
         this.initialize()
   this.getBrandList()

  }
  brandList:any=[]
  data:any
    getBrandList() {
    this.share.showLoading('Loading...');
    let obj = this.share.getListObj('brand', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.brandList = res.data;
        this.brandList = this.brandList.reverse();
        if (!this.customerDetails?.soldStatus) {
          this.form.controls['brand_id'].setValue(this.brandList[0]?.id);
        }
        this.getModelList();
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  save(){
        if(this.form?.valid){
     let obj = {
        src: 'sold_customer_record',
        data: this.form.value,
      };
      this.share.showLoading("Saving")
      this.api.postapi('addOpp', obj).subscribe((res:any) => {
     
        this.share.spinner?.dismiss();
      this.share.presentToast("Saved...")
       this.modalCntrol.dismiss(true)
    
      });
    }
    else{
      this.share.presentToast("Please fill required fields")
    }

  }
  update(){
    if(this.form?.valid){
     let obj = {
        src: 'sold_customer_record',
        data: this.form.value,
        id:this.customerDetails?.soldStatus?.id
      };
      this.share.showLoading("Updating")
      this.api.postapi('updateOpp', obj).subscribe((res:any) => {
     
        this.share.spinner?.dismiss();
      this.share.presentToast("Updated Successfully...")
      this.modalCntrol.dismiss(true)
    
      });
    }
    else{
      this.share.presentToast("Please fill required fields")
    }
  }

  dismiss(){
    this.modalCntrol.dismiss()
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
        if (!this.customerDetails?.soldStatus) {
          this.getModelsbyBrand();
        } else {
          this.getModelsbyBrand(false);
        }
        this.share?.spinner?.dismiss();
      },
      (error: any) => {}
    );
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
  }
  staffDetails: any;
  form:FormGroup
  customerDetails:any
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    let date = new Date();
    let currentYear = date.getFullYear();
    this.form = this.fb.group({
      brand_id: new FormControl(this.customerDetails?.soldStatus?.brand_id || null, [
        Validators.required,
      ]),
      model_id: new FormControl(this.customerDetails?.soldStatus?.model_id || null, [
        Validators.required,
      ]),
      tfCode: new FormControl(this.customerDetails?.soldStatus?.tfCode || null, [Validators.required]),
      customer_id: new FormControl(this.customerDetails?.id || null, [Validators.required]),
      dateOfSale: new FormControl(this.customerDetails?.soldStatus?.dateOfSale || null, [Validators.required]),
  
    
   
    });
  }
}
