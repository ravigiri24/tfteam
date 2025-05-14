import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { AddDemandComponent } from './add-demand/add-demand.component';
import { AddVisitngStatusComponent } from './add-visitng-status/add-visitng-status.component';
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
  visitng_history:any=[]
  demand_history:any=[]
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
this.visitng_history=res?.data?.visitng_record
this.demand_history=res?.data?.demands
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  async addDemand(){
  const modal = await this.modalctr.create({
        component: AddDemandComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.6,
        cssClass: 'custom-modal',
        componentProps: {
         customerSelected:this.customerSelected
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if ( data?.isAdd) {
     this.getCustomerById()
      }
  
  }
    async presentModal() {
    
    }
async  visiting_dates(){
  const modal = await this.modalctr.create({
        component: AddVisitngStatusComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.6,
        cssClass: 'custom-modal',
        componentProps: {
         customerSelected:this.customerSelected
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if ( data?.isAdd) {
     this.getCustomerById()
      }
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
