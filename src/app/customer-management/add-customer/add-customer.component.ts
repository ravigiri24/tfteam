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
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) {}
  @Output() closeModal = new EventEmitter();
  @Output() updateList = new EventEmitter();

  @Input() editData: any = null;
  @Input() staffList: any = null;
  ngOnInit() {
    console.log('editData', this.editData);

    this.initialize();
    this.getStateList();
    // this.getCityList()
  }
  name: any;
  message: any;
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  customerForm: FormGroup;
  staffDetails: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.customerForm = this.fb.group({
      name: new FormControl(this.editData?.name || null, [Validators.required]),
      mobileNo: new FormControl(this.editData?.mobileNo || null, [
        Validators.required,
      ]),
      customerType: new FormControl(this.editData?.customerType || 'DIGITAL', [
        Validators.required,
      ]),
      storeId: new FormControl(this.staffDetails?.storeId, [
        Validators.required,
      ]),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
      state_id: new FormControl(this.editData?.state_id, []),
      city_id: new FormControl(this.editData?.city_id, []),
      id: new FormControl(this.editData?.id || null),
      remark: new FormControl(null, []),
      assigned_staff_id: new FormControl(null, []),
      socialType: new FormControl(this.editData?.socialType , []),
      demand: new FormControl(null, []),
      visiting_date:new FormControl(null, []),
      purchasing_possibility:new FormControl(null, []),
    });
    if(!this.editData){
      this.customerForm.controls['purchasing_possibility'].setValue('WILL_VISIT')
    }
  }
  stateList: any = [];
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        if(this.editData?.state_id){

      let find= this.stateList.find((d:any)=>d.id==this.customerForm.controls['state_id'].value)  
      if(find){
        this.stateName = find?.name;
      } 
        }
        this.getCityList();
      },
      (error: any) => {}
    );
  }
  clearsocialType(){
    if(this.customerForm.controls['customerType'].value=='VISITORS'){
this.customerForm.controls['socialType'].setValue(null)
    }
  }
  cityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
        let find= this.cityList.find((d:any)=>d.id==this.customerForm.controls['city_id'].value)  
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
    let getStateId = this.customerForm?.controls['state_id']?.value;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  loader = false;
  getListOfStaff() {}
  saveForm() {
    let obj = this.customerForm.value;
    console.log(this.customerForm.value);
    if (this.customerForm.valid) {
      this.showLoading();
      this.api.postapi('addCustomerLocationWise', obj).subscribe((res: any) => {
        this.spinner?.dismiss();
        this.presentToast(res?.msg);

        this.loader = false;
        this.updateList.emit(res?.data);
        this.closeModal.emit();
      });
    } else {
      this.presentToast('Please Fill All Fields');
    }
  }
  stateName: any;
  cityName: any;
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (
      itemName == 'City' &&
      this.customerForm.controls['state_id'].value 
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
        state_id: this.customerForm.controls['state_id'].value,
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
        this.customerForm.controls['state_id'].setValue(data?.id);
        this.customerForm.controls['city_id'].setValue(null);
        this.cityName = null;
        this.stateName = data?.name;
        this.getCityListFilter();
      }
    } else if (itemName == 'City') {
      this.cityName = data?.name;
      this.customerForm.controls['city_id'].setValue(data?.id);
    }
    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }else{
    this.share.presentToast("Please Select State First")
  }
  }
  updateForm() {
    if (this.customerForm.valid) {
      let obj: any = this.customerForm.value;
      obj.id = this.editData?.id;
      this.showLoading();
      this.api.postapi('updateCustomerLocationWise', obj).subscribe(
        (res: any) => {
          console.log('$getUpdatedData', res);

          this.spinner?.dismiss();
          this.presentToast(res?.msg);
          this.updateList.emit(res?.data);
          this.closeModal.emit();
        },
        (error: any) => {
          this.spinner?.dismiss();
        }
      );
    } else {
      this.presentToast('Please Fill All Fields');
    }
  }

  spinner: any;
  async showLoading() {
    this.spinner = await this.loadingCtrl.create({
      message: 'Saving...',
      duration: 20000,
    });

    this.spinner.present();
  }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
}
