import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-view-customer-data',
  templateUrl: './view-customer-data.component.html',
  styleUrls: ['./view-customer-data.component.scss'],
})
export class ViewCustomerDataComponent implements OnInit {
  customerSelected: any;
  constructor(
    private modalctr: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}
  nextFolloupHistory: any = [];
  chatHistory: any = [];
  ngOnInit() {
    console.log('ViewCustomerDataComponent', this.customerSelected);
    this.getCustomerById()
  }
  cancel() {
    this.modalctr.dismiss();
  }
  staffDetails: any;
  getCustomerById() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      id: this.customerSelected?.id,
    };
    this.share.showLoading('Loading...');
    this.api.postapi('getCustomerById', obj).subscribe(
      (res: any) => {
        this.customerSelected = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
        this.filterChats();

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  filterChats() {
    this.nextFolloupHistory = this.customerSelected?.leadsChat?.filter(
      (next: any) => next?.chat_type == 'FOLLOW_UP_DATE'
    );
    this.chatHistory = this.customerSelected?.leadsChat?.filter(
      (next: any) => next?.chat_type == 'CHAT'
    );
  }
}
