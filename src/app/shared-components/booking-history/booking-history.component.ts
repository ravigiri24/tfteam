import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SelectWithSearchComponent } from '../select-with-search/select-with-search.component';
import { DatePipe } from '@angular/common';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';
import { ViewBookingComponent } from './view-booking/view-booking.component';
@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.scss'],
})
export class BookingHistoryComponent  implements OnInit {

  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private share: ShareService,
    private alertCtrl:AlertController,
    private datePipe: DatePipe
  ) {}
  @Input() listColorClass: any = "fifthColor";
  ngOnInit() {

    this.getBookingByTractor()
  }
  dismiss() {
    this.modalController.dismiss();
  }
  staffDetails: any;
  jobType = false;
  jobList: any = [];
  tractor: any;
  getBookingByTractor(){
    
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id:this.tractor?.id
    };
   this.share.showLoading('Loading');
    this.api.postapi('getBookingByTractor', obj).subscribe(
      (res: any) => {
    this.bookingList=res?.data
       this.getLastBookingStatusByTractor()

        this.share.spinner.dismiss();
      
      },
      (error: any) => {
     
      }
    );
  }
  lastBookingStatus:any
    getLastBookingStatusByTractor(){
    
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id:this.tractor?.id
    };
  
    this.api.postapi('getLastBookingStatusByTractor', obj).subscribe(
      (res: any) => {
    this.lastBookingStatus=res?.data

    
      
      },
      (error: any) => {
     
      }
    );
  }
  async viewBooking(booking:any){
  const modal = await this.modalController.create({
        component: ViewBookingComponent,
      cssClass: 'custom-modal',
        componentProps: {
          tractor: this.tractor,
          tractorDetails: booking,
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {

      }
  }
  cancleBooking(booking:any){

  }
  async deleteItem(job: any) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Job',
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.removeJob(job);
    }
  }
  removeJob(job:any){
    let objData: any = {
      mappedTractorId:null,
    };
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: job?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Removed Successfully...');
      this.getBookingByTractor()
    //  this.dismiss();
    });
  }

  bookingList: any = [];


     async addBooking(bookedData: any=null) {
      const modal = await this.modalController.create({
        component: AddBookingComponent,
      cssClass: 'custom-modal',
        componentProps: {
          tractor: this.tractor,
          bookedData: bookedData,
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
 this.getBookingByTractor()
        //this.callListApi();
      }
    }
       async cancelBooking(bookedData: any=null) {
      const modal = await this.modalController.create({
        component: CancelBookingComponent,
      cssClass: 'custom-modal',
        componentProps: {
          tractor: this.tractor,
          bookedData: bookedData,
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
 this.getBookingByTractor()
        //this.callListApi();
      }
    }
  addNewJob(job_id: any) {
  
    let objData: any = {
      mappedTractorId: this.tractor?.id,
    };
    let obj = {
      src: 'repairing_record',
      data: objData,
      id: job_id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Added Successfully...');
      this.getBookingByTractor()
   
      this.dismiss();
    });
  }

}
