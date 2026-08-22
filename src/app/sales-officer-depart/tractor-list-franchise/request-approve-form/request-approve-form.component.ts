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

@Component({
  selector: 'app-request-approve-form',
  templateUrl: './request-approve-form.component.html',
  styleUrls: ['./request-approve-form.component.scss'],
})
export class RequestApproveFormComponent implements OnInit {
  approvalData: any;
  data: any;
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) {}
  staffDetails: any;
  selectedStore: any;
  @Input() listColorClass = 'sixColor';
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    //     let selectedStore: any = this.share.get_sales_officer_store();
    // console.log('staffDetails', staffDetails);
    // this.selectedStore = JSON.parse(selectedStore);
this.getStoreByid()
this.getCityList()
this.getStateList()
    this.initialize(this.approvalData);
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
  tractor: any;

  formWarehouse: FormGroup;
  initialize(data: any = null) {
    let store_id = this.selectedStore;

    this.form = this.formBuilder.group({
      tractor_id: new FormControl(this.tractor?.id, [Validators.required]),
      approvePrice: new FormControl(data?.approvePrice, [Validators.required]),
      expectedDateOfSale: new FormControl(data?.approvePrice, []),
      remark: new FormControl(data?.remark, []),

      storeId: new FormControl(this.selectedStore, [Validators.required]),
      actionByid: new FormControl(this?.staffDetails?.id, [
        Validators.required,
      ]),
      requestBy: new FormControl(this?.staffDetails?.id, [Validators.required]),

      customerName: new FormControl(data?.customerName, []),
      mobileNo: new FormControl(data?.mobileNo, [Validators.required]),
      village: new FormControl(data?.village, [Validators.required]),
      state_id: new FormControl(data?.state_id, []),
      city_id: new FormControl(data?.city_id, []),
      booking_price: new FormControl(data?.booking_price, [Validators.required]),
      sale_type: new FormControl(data?.sale_type , [Validators.required]),
    });

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
   stateList: any = [];
  stateName:any
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
   
        this.getCityList();
      },
      (error: any) => {}
    );
  }
  
  cityList: any = [];
  cityName:any
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        let find= this.cityList.find((d:any)=>d.id==this.form.controls['city_id'].value)  
        if(find){
          this.cityName = find?.name;
        } 
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  cityListFilter: any = [];
  getCityListFilter() {
    let getStateId = this.form?.controls['state_id']?.value;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
      checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (
      itemName == 'City' &&
      this.form.controls['state_id'].value 
    ) {
      if(this.cityListFilter?.length){
        return true;
      }else{
        this.getCityListFilter()
   
        return true;
      }
   
    } else {
      return false;
    }
  }
    async selectItem(list: any, itemName: any, table_name: any) {
      let openStatus = this.checkOpenCon(itemName);
      if(openStatus){
  
     
      let otherObjects: any;
      if (itemName == 'City') {
        list=this.cityListFilter
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
          jsonKey:'name',
          search:  {
            name: null,
          }
        },
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
        //this.getCityList()
  
      }
      console.log('role', role, data);
  
      if (role === 'confirm') {
      }
    }else{
      this.share.presentToast("Please Select State First")
    }
    }
  getModel() {
    let valueOf = this.form.controls['modal_ids']?.value || [];
    return valueOf;
  }
  storeData: any;
  getStoreByid() {
    let obj = this.share.getDataByIdObj(
      'warehouselocation',
      'id',
      this.selectedStore
    );

    this.api.postapi('getDataById', obj).subscribe((res: any) => {
      this.storeData = res?.data;
      //  this.dismiss();
    });
  }

  save() {
    if (this.form.valid) {
      let objVal = this.form.value;
      let obj = {
        src: 'approvalfortractor',
        data: objVal,
      };
      this.share.showLoading('Requesting');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        let approvalData=res?.rowData
        let description =
          this.staffDetails?.name +
          ' has requested the sale of an ' +
          this.tractor?.name +
          ' for ' +
          this.form?.value?.approvePrice+' at '+this.storeData?.name;
        this.api.genreteEnquiry(
          'Request For Approval',
          description,
        {store_id:this.selectedStore}  ,
          this.staffDetails,'APPROVAL',approvalData?.id
        );
        this.share.spinner.dismiss();

        this.share.presentToast('Request Sent Successfully...');

        this.modalCtrl.dismiss(true);
        //  this.dismiss();
      });
    } else {
      if (!this.form.valid) {
        this.share.presentToast('Please Fill Required Fields');
      }
    }
  }
  update() {
    if (this.form.valid) {
      let obj: any = this.form.value;
      obj.operate = this.share.getStaffObj()?.operate;
      obj.id = this.approvalData?.id;
      this.share.showLoading('Updating...');

      this.api.postapi('updateEnquiry', obj).subscribe(
        (res: any) => {
          this.share.presentToast('Enquiry Updated Successfully');
          this.share.spinner.dismiss();

          this.modalCtrl.dismiss(true);
        },
        (error: any) => {}
      );
    } else {
      if (!this.form.valid) {
        this.share.presentToast('Please Fill Required Fields');
      }
    }
  }
  deleteModel(model: any) {
    let valueOf = this.form.controls['modal_ids'].value;
    let findIn = valueOf?.findIndex((f: any) => f.id == model?.id);
    valueOf.splice(findIn, 1);
    this.form.controls['modal_ids'].setValue(valueOf);
  }
  updates() {}
}
