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
      deal_price: new FormControl(data?.deal_price, [Validators.required]),
      booking_price: new FormControl(data?.booking_price, []),
      currentStatus: new FormControl('OPEN'),
      booking_date: new FormControl(data?.booking_date , []),
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
