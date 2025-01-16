import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDeliveryComponent } from 'src/app/transport-management/confirm-delivery/confirm-delivery.component';
import { AddTransportStatusComponent } from 'src/app/transport-management/add-transport-status/add-transport-status.component';
import { StartRepairDialogComponent } from 'src/app/transport-management/start-repair-dialog/start-repair-dialog.component';
import { ImageDashboardComponent } from 'src/app/maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from 'src/app/maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { StartTransportDialogComponent } from 'src/app/transport-management/start-transport-dialog/start-transport-dialog.component';
import { TractorSellsDetailsComponent } from 'src/app/tractor-sells-details/tractor-sells-details.component';
import { TractorFinanceDetailsComponent } from 'src/app/tractor-finance-details/tractor-finance-details.component';
import { SellDocumentComponent } from 'src/app/sell-document/sell-document.component';
import { OtherExpenseListComponent } from 'src/app/tractor-dashboard/other-expense-list/other-expense-list.component';

@Component({
  selector: 'app-tractor-costing-dashboard',
  templateUrl: './tractor-costing-dashboard.component.html',
  styleUrls: ['./tractor-costing-dashboard.component.scss'],
})
export class TractorCostingDashboardComponent  implements OnInit {

  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private route:Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit() {} 
   tractor_id:any
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.tractor_id = params?.id;
    });
    this.getTractorDetails()
  }

  staffDetails:any
  getTractorDetails(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractor_id,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorByIdAllDetails', obj).subscribe(
      (res: any) => {
        this.tractorDetails = res?.data;
    
        this.share.spinner.dismiss();
     
      },
      (error: any) => {}
    );
  }
  backToList(){
 
    this.route.navigate(['/admin-block/tractor-costing'])
  }
  purchaseCost:any=0
  logisticCost:any=0
  maintainanaceCost:any=0
  otherExpenseCost:any=0
  sellingPrice:any=0
  totalExpense:any=0
  allExpenses:any=0
  purchaseAndAllExpenseCost:any=0
  sellPrice:any=0

  addStatusTransport() {
    this.showModal(this.tractorDetails?.id);
  }
  async showModal(tractor_id: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddTransportStatusComponent,
      componentProps: {
        tractor_id: tractor_id,
      },
    });
    await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);

    // if (role === 'confirm') {

    // }
  }
  addCost() {
    this.route.navigate(['/operational/add-cost', this.tractorDetails?.id]);
  }
  async showDeliveryModal() {
    const modal = await this.modalCtrl.create({
      component: ConfirmDeliveryComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
     this.getTractorDetails('Refreshing Data...');
    }
  }
}
