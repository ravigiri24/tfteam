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
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
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
export class TractorCostingDashboardComponent implements OnInit {
  tractorDetails: any;
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}
  tractor_id: any;
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.tractor_id = params?.id;
    });
    this.getTractorDetails();
    this.getLogisticList();
    this.getMaintanance();
    this.getListOther()
  
  }
  financeData:any
  getDataByIDFinance(){
    
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.financeDetailedId);
    this.api.postapi('getFinanceetailsByID', obj).subscribe(
      (res:any) => {
        this.financeData = res?.data;
        console.log("financeData",this.financeData);
        
    },
      (error:any) => {
     
      }
    );
  }
  sellingData:any
  getDataByIDSellData(){
    
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.sellingDetailedId);
    this.api.postapi('getSellingDetailsByID', obj).subscribe(
      (res:any) => {
        this.sellingData = res?.data;
        this.sellingPrice=Number(res?.data?.sellingPrice||0)
        console.log("sellingData",this.sellingData);
      },
      (error:any) => {
       
      }
    );
  }
  getMaintanance() {
    this.getMaterialList();
    this.getServiceList();
    this.getManualExpenseList();
  }
  expenseMaterialList: any = [];
  prdeictionMaterialList: any = [];
  getMaterialList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractor_id;
  //  this.share.showLoading('Fetching Data...');
    this.api.postapi('getMaterialExpense', obj).subscribe(
      (res: any) => {
        this.expenseMaterialList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        this.prdeictionMaterialList = res?.data.filter(
          (f: any) => f?.expense_head == 'PREDICTION'
        );
        this.share.spinner.dismiss();
        console.log('expenseMaterialList', this.expenseMaterialList);

     //   this.share.spinner.dismiss();
        this.calculateAmountMaintainance();
        this.combinedMaintainance();
      },
      (error: any) => {}
    );
  }
  listDataOther: any;
  totalAmountOther = 0;
  getListOther() {
    let obj: any = this.share.getListObj('other_expenses_cost', false, [], true);
    obj.tractor_id = this.tractor_id;
    //this.share.showLoading('Loading...');
    this.api.postapi('getExtraExpenseDetailsById', obj).subscribe(
      (res: any) => {
        this.listDataOther = res.data;
     
     
        this.listDataOther.reverse();
        this.totalAmountOther = 0;
        this.listDataOther?.forEach((f: any) => {
          this.totalAmountOther =
            Number(this.totalAmountOther) + Number(f?.expense_amount);
        });
        this.otherExpenseCost=this.totalAmountOther
    //    this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseMaterialCost: any = 0;
  expenseServiceCost: any = 0;
  expenseManualCost: any = 0;
  prdeictionMaterialCost: any = 0;
  predictionServiceCost: any = 0;
  predictionManualCost: any = 0;
  calculateAmountMaintainance() {
    this.expenseMaterialCost = 0;
    this.expenseServiceCost = 0;
    this.prdeictionMaterialCost = 0;
    this.predictionServiceCost = 0;
    this.expenseManualCost = 0;
    this.predictionManualCost = 0;
    this.expenseMaterialList.forEach((f: any) => {
      this.expenseMaterialCost =
        this.expenseMaterialCost + Number(f?.total_expense);
    });
    this.expenseServiceList.forEach((f: any) => {
      this.expenseServiceCost =
        this.expenseServiceCost + Number(f?.total_expense);
    });
    this.expenseManualList.forEach((f: any) => {
      this.expenseManualCost =
        this.expenseManualCost + Number(f?.total_expense);
    });
    this.prdeictionMaterialList.forEach((f: any) => {
      this.prdeictionMaterialCost =
        this.prdeictionMaterialCost + Number(f?.total_expense);
    });
    this.prdeictionServiceList.forEach((f: any) => {
      this.predictionServiceCost =
        this.predictionServiceCost + Number(f?.total_expense);
    });
    this.prdeictionManualList.forEach((f: any) => {
      this.predictionManualCost =
        this.predictionManualCost + Number(f?.total_expense);
    });
    this.maintainanaceCost =
      (this.expenseMaterialCost || 0) +
      (this.expenseServiceCost || 0) +
      (this.expenseManualCost || 0);
  }
  expenseServiceList: any = [];
  prdeictionServiceList: any = [];
  getServiceList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractor_id;
    //this.share.showLoading('Fetching Data...');
    this.api.postapi('getServiceExpense', obj).subscribe(
      (res: any) => {
        this.expenseServiceList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        this.prdeictionServiceList = res?.data.filter(
          (f: any) => f?.expense_head == 'PREDICTION'
        );
        this.share.spinner.dismiss();
        console.log('expenseServiceList', this.expenseServiceList);
        this.calculateAmountMaintainance();
        this.combinedMaintainance();
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseManualList: any = [];
  prdeictionManualList: any = [];
  getManualExpenseList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractor_id;
    //this.share.showLoading('Fetching Data...');
    this.api.postapi('getManualExpense', obj).subscribe(
      (res: any) => {
        this.expenseManualList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        this.prdeictionManualList = res?.data.filter(
          (f: any) => f?.expense_head == 'PREDICTION'
        );
        this.share.spinner.dismiss();
        console.log('expenseServiceList', this.expenseServiceList);
        this.calculateAmountMaintainance();
        this.combinedMaintainance();
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  allMaintainance: any = [];
  combinedMaintainance() {
    this.allMaintainance = [];
    this.expenseMaterialList?.forEach((f: any) => {
      this.allMaintainance?.push(f);
    });
    this.expenseServiceList?.forEach((f: any) => {
      this.allMaintainance?.push(f);
    });
    this.expenseManualList?.forEach((f: any) => {
      this.allMaintainance?.push(f);
    });
  }
  async viewImage(imageGroup:any){
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
     
        tarctor_id: this.tractor_id,
        imageGroup:imageGroup,
        uploadPhoto:false
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
   async viewImageLive(){
 
   let imageArray:any=[]
   
   if(this.tractorDetails?.leftImageUrl){
    imageArray.push({imageUrlUrl:this.tractorDetails?.leftImageUrl})
    }
    if(this.tractorDetails?.rightImageUrl){
     imageArray.push({imageUrlUrl:this.tractorDetails?.rightImageUrl})
    }
    if(this.tractorDetails?.frontImageUrl){
     imageArray.push({imageUrlUrl:this.tractorDetails?.frontImageUrl})
    }
  if(this.tractorDetails?.backImageUrl){
   imageArray.push({imageUrlUrl:this.tractorDetails?.backImageUrl})
  }
  
      const modal = await this.modalCtrl.create({
        component: ImageViewerComponent,
        componentProps: {
       
          tarctor_id: this.tractor_id,
          imageGroup:null,
          uploadPhoto:false,
          imageArray:imageArray,
          callApi:false
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
     
      }
    }
  staffDetails: any;
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
        console.log('  this.tractorDetails', this.tractorDetails);
        if (this.tractorDetails?.purchasedetail?.purchasePrice) {
          this.purchaseCost = Number(
            this.tractorDetails?.purchasedetail?.purchasePrice
          );
        }
        this.getDataByIDSellData()
        this.getDataByIDFinance()
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  logisticData: any = [];
  getLogisticList() {
    let obj: any = this.share.getListObj('transport_cost', false, [], true);
    obj.tractor_id = this.tractor_id;
    this.logisticCost = 0;
    //  this.share.showLoading('Loading...');
    this.api.postapi('getTransportDetailsById', obj).subscribe(
      (res: any) => {
        this.logisticData = res.data;

        this.logisticData.reverse();
        this.logisticCost = 0;
        if (this.logisticData?.length) {
          this.logisticData?.forEach((f: any) => {
            this.logisticCost =
              Number(this.logisticCost) + Number(f?.expense_amount);
          });
        }
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  backToList() {
    this.route.navigate(['/admin-block/tractor-costing']);
  }
  purchaseCost: any = 0;
  logisticCost: any = 0;
  maintainanaceCost: any = 0;
  otherExpenseCost: any = 0;
  sellingPrice: any = 0;
  totalExpense: any = 0;
  allExpenses: any = 0;
  purchaseAndAllExpenseCost: any = 0;
  sellPrice: any = 0;

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
