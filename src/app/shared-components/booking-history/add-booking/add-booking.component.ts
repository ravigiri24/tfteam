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
import { ViewModelsComponent } from 'src/app/sales-officer-depart/add-enquiry/view-models/view-models.component';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss'],
})
export class AddBookingComponent  implements OnInit {

 enquiry: any;
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
    let selectedStore: any = this.share.get_sales_officer_store();
    console.log('staffDetails', staffDetails);
    this.selectedStore = JSON.parse(selectedStore);
this.getStateList()
    this.initialize(this.bookedData);
    if(!this.tractor?.franchiseDettails?.id){
      this.share.presentToast("Store Not Alloted")
      setTimeout(() => {
        this.modalCtrl.dismiss()
      }, 1000);
    }
    // this.generateNotifcationToAboveStaff()
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  form: FormGroup;
  bookedData:any

  formWarehouse: FormGroup;
  initialize(data: any = null) {
    

    this.form = this.formBuilder.group({
      tractor_id: new FormControl(this.tractor?.id, [Validators.required]),
      customerName: new FormControl(data?.customerName, []),
      mobileNo: new FormControl(data?.mobileNo, []),
      village: new FormControl(data?.village, []),
      state_id: new FormControl(data?.state_id, []),
      city_id: new FormControl(data?.city_id, []),
      deal_price: new FormControl(data?.deal_price, [Validators.required]),
      booking_price: new FormControl(data?.booking_price, []),
      currentStatus: new FormControl('OPEN'),
      booking_date: new FormControl(data?.booking_date , []),
      sale_type: new FormControl(data?.sale_type , [Validators.required]),
      expectedDateForSale: new FormControl(data?.expectedDateForSale , []),
      remark: new FormControl(data?.remark, []),
      store_id: new FormControl(this.tractor?.franchiseDettails?.id, [
        Validators.required,
      ]),
      actionByid: new FormControl(this?.staffDetails?.id, [
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
  stateList: any = [];
  stateName:any
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        if(this.bookedData?.state_id){

      let find= this.stateList.find((d:any)=>d.id==this.form.controls['state_id'].value)  
      if(find){
        this.stateName = find?.name;
      } 
        }
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
  save() {
    if (this.form.valid) {
    
      this.share.showLoading('Booking...');
       let objVal: any = this.form.value;
    let obj = {
        src: 'booking_history',
        data: objVal,
      };

      this.api.postapi('addOpp', obj).subscribe(
        (res: any) => {
      
          this.share.presentToast('Booking Confirm');
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
  tractor:any
  update() {
    if (this.form.valid) {
     this.share.showLoading('Booking...');
       let objVal: any = this.form.value;
      let obj = {
        src: 'booking_history',
        data: objVal,
        id: this.bookedData?.id,
      };
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
          this.share.presentToast('Updated Confirm');
      this.modalCtrl.dismiss(true);
      });
    } else {
      if (!this.form.valid) {
        this.share.presentToast('Please Fill Required Fields');
      }
    }
  }
  
  updates() {}

}
