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
@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss'],
})
export class ViewBookingComponent  implements OnInit {
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

  ngOnInit() {
    this.getBookigDeatials()
  

  //   this.getDetails()
  }


  tractorDetails:any
  getBookigDeatials() {
    let obj: any = this.share.getListObj('booking_details', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.share.showLoading('Loading...');
    this.api.postapi('get_booking_details_byId', obj).subscribe(
      (res: any) => {
        this.tractorDetails = res.data;
     
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
 

}
