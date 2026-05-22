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
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
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
    private modalCntrol: ModalController,
    private modalCtrl:ModalController,
    
  ) {}

  ngOnInit() {
    this.initialize();
    this.getBrandList();
    this.getDealerList()
    this.createYearArray()
  }
    yearArray: any = [];
  createYearArray() {
    let date = new Date();
    let getyear = date.getFullYear();
    let tillyear = Number(getyear) - 41;
    for (let index = getyear; index > tillyear; index--) {
      this.yearArray.push(index);
    }
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
    getPurchaseNumber() {
      //    if (this.newFindingForms.valid) {
      
    this.modelList = [];
     let prchaseNo=null
    let obj = this.share.getListObj('model', false, [], false);
    // this.share.showLoading('Loading...')
    this.api.postapi('getPurchaseNumberLast', obj).subscribe(
      (res: any) => {
      let lastPurchaseNo=res?.data?.purchaseSrNo
      if(res?.data && lastPurchaseNo){
let arr = lastPurchaseNo.split("-");
console.log("arr",arr);
let number=Number(arr[1])
let newnumber=number+1
let prNo='PR-'+newnumber
this.saveForm(prNo)
      }else{
        let prchaseNo="PR-1"
        this.saveForm(prchaseNo)
      }
 
      
      },
      (error: any) => {}
    );
  // }
  // else {
  //     this.share.presentToast('Please Fill required fields');
  //     this.newFindingForms.markAllAsTouched();
  //   }
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
    dealerList: any = [];

  getDealerList(loader:any=false) {
    this.dealerList = [];
    let obj = this.share.getListObj('dealer_list', false, [], false);
    if(loader){
this.share.showLoading('Loading...')
    }
    // this.share.showLoading('Loading...')
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.dealerList = res.data;
         if(loader){
        this.share?.spinner?.dismiss();
         }
         this.setDealerName()
      },
      (error: any) => {}
    );
  }
  setDealerName() {


    let dealerDetail = this.dealerList.find(
      (f: any) => f.id == this.data?.dealerId,
    );
    if (dealerDetail) {
      this.dealerName = dealerDetail?.name;
    }
  }
    async openCrudManagement(type: any) {
      const modal = await this.modalCtrl.create({
        component: CrudPopupComponent,
        componentProps: {
          type: type,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
  
      this.getDealerList(true)
      console.log('role', role);
    }
       async selectItem(list: any, itemName: any, table_name: any) {
        const modal = await this.modalCtrl.create({
          component: SelectWithSearchComponent,
          componentProps: {
            list: list,
            itemName: itemName,
            table_name: table_name,
            showAddButton:false,
            otherObjects: null,
            jsonKey: 'name',
            search: {
              name: null,
            },
          },
        });
        await modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
        if (data) {
       
          this.newFindingForms.controls['dealerId'].setValue(data?.id);
    
          this.dealerName = data?.name;
          //this.resetOtherValue()
        }
    
        console.log('role', role, data);
    
        if (role === 'confirm') {
        }
      }
      dealerName:any
  getModelsbyBrand(setValue:any=true) {
    if(setValue){
    this.newFindingForms.controls['model_id'].setValue(null);
    }
    this.modelList = this.modelListAll.filter(
      (f: any) => f.brandID == this.newFindingForms.controls['brand_id']?.value
    );
    if (this.modelList?.length && !setValue) {
      this.newFindingForms.controls['model_id'].setValue(this.data?.model_id);
    }
  }
  dismiss() {
    this.modalCntrol.dismiss();
  }
  saveForm(prNo:any) {
 
    if (this.newFindingForms.valid) {
      
      let obj:any = {
        src: 'new_findings',
        data: this.newFindingForms.value,
      };
      obj.data.purchaseSrNo=prNo
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
        return this.modalCntrol.dismiss(true, 'confirm');

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
        let yearOfManufactoring=null
    if(this.data?.yearOfManufactoring){
     yearOfManufactoring=Number(this.data?.yearOfManufactoring)
    }

    this.newFindingForms = this.fb.group({
      brand_id: new FormControl(this.data?.brand_id || null, [
        Validators.required,
      ]),
      model_id: new FormControl(this.data?.model_id || null, [
        Validators.required,
      ]),
 
      quoteByDealer: new FormControl(this.data?.quoteByDealer, []),
      quoteByTf: new FormControl(this.data?.quoteByTf, []),
      finalPrice: new FormControl(this.data?.finalPrice, []),
      tyreCondition: new FormControl(this.data?.tyreCondition, [Validators.required]),
      bodyCondition: new FormControl(this.data?.bodyCondition, [Validators.required]),
      dealerId: new FormControl(this.data?.dealerId, [Validators.required]),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
      yearOfManufactoring: new FormControl(yearOfManufactoring, [Validators.required]),
      registractionNo: new FormControl(this.data?.registractionNo, []),
      hours: new FormControl(this.data?.hours, [Validators.required]),
      id: new FormControl(this.data?.id || null),
      remark: new FormControl(this.data?.remark, []),
      chassisNumber: new FormControl(this.data?.chassisNumber, []),
      engineNo: new FormControl(this.data?.engineNo, []),
      selling_estimation: new FormControl(this.data?.selling_estimation, []),
    });
  }
}
