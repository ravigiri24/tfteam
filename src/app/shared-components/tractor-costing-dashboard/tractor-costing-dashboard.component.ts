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
  dismiss() {
    this.modalCtrl.dismiss();
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    this.getTractorDetails();
    this.getLogisticList();
    this.getMaintanance();
    this.getListOther();
  }

  tractor_id: any;
  ionViewWillEnter() {
    // this.activatedRoute.params.subscribe((params: any) => {
    //   this.tractor_id = params?.id;
    // });
    // this.getTractorDetails();
    // this.getLogisticList();
    // this.getMaintanance();
    // this.getListOther()
  }
  financeData: any;
  getDataByIDFinance() {
    let obj = this.share.getDataId(
      null,
      false,
      [],
      this.tractorDetails?.financeDetailedId
    );
    this.api.postapi('getFinanceetailsByID', obj).subscribe(
      (res: any) => {
        this.financeData = res?.data;
        console.log('financeData', this.financeData);
      },
      (error: any) => {}
    );
  }
  rtoCost:any=0
  insuranceCost:any=0
  sellingData: any;
  getDataByIDSellData() {
    let obj = this.share.getDataId(
      null,
      false,
      [],
      this.tractorDetails?.sellingDetailedId
    );
    this.api.postapi('getSellingDetailsByID', obj).subscribe(
      (res: any) => {
        this.sellingData = res?.data;
        this.sellingPrice = Number(res?.data?.sellingPrice || 0);
        console.log('sellingData', this.sellingData);
      },
      (error: any) => {}
    );
  }
  getMaintanance() {
    this.getSavedJobList();

    //  this.getManualExpenseList();
  }
  savedJobList: any = [];
  getSavedJobList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractor_id,
    };
    this.share.showLoading('Loading');
    this.api.postapi('getJobsByTractor', obj).subscribe(
      (res: any) => {
        this.savedJobList = res?.data;
        //this.share.spinner.dismiss();

        this.savedJobList?.forEach((job: any) => {
          let objectCosting: any = {};
          objectCosting = job;
          this.getMaterialList(job?.id, objectCosting);
          this.getServiceList(job?.id, objectCosting);
          this.getReduceList(job?.id, objectCosting);
        });
        setTimeout(() => {
          console.log('savedJobList', this.savedJobList);
        }, 0);
      },
      (error: any) => {}
    );
  }
  reduceItemList: any = [];
  getReduceList(JobId: any, object: any) {
    let obj: any = this.share.getListObj('reduce_costing', false, [], true);
    obj.job_id = JobId;

    this.api.postapi('getReduceItemList', obj).subscribe(
      (res: any) => {
        object.reduceItemList = res?.data;

        this.calculateAmountMaintainance();
        this.combinedMaintainance();
      },
      (error: any) => {}
    );
  }
  expenseMaterialList: any = [];
  prdeictionMaterialList: any = [];
  getMaterialList(JobId: any, object: any) {
    let obj: any = this.share.getListObj(
      'repair_expense_costing',
      false,
      [],
      true
    );
    obj.tractor_id = JobId;

    this.api.postapi('getMaterialExpense_cost', obj).subscribe(
      (res: any) => {
        // this.expenseMaterialList = res?.data.filter(
        //   (f: any) => f?.expense_head == 'EXPENSE'
        // );
        object.expenseMaterialList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
        // this.share.spinner.dismiss();
        console.log('expenseMaterialList', this.expenseMaterialList);

        this.calculateAmountMaintainance();
        this.combinedMaintainance();
      },
      (error: any) => {}
    );
  }
  // getMaterialList() {
  //   let obj: any = this.share.getListObj('reparing_cost', false, [], true);
  //   obj.tractor_id = this.tractor_id;

  //   this.api.postapi('getMaterialExpense', obj).subscribe(
  //     (res: any) => {
  //       this.expenseMaterialList = res?.data.filter(
  //         (f: any) => f?.expense_head == 'EXPENSE'
  //       );
  //       this.prdeictionMaterialList = res?.data.filter(
  //         (f: any) => f?.expense_head == 'PREDICTION'
  //       );
  //       this.share.spinner.dismiss();
  //       console.log('expenseMaterialList', this.expenseMaterialList);

  //       this.calculateAmountMaintainance();
  //       this.combinedMaintainance();
  //     },
  //     (error: any) => {}
  //   );
  // }
  listDataOther: any;
  totalAmountOther = 0;
  getListOther() {
    let obj: any = this.share.getListObj(
      'other_expenses_cost',
      false,
      [],
      true
    );
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
        this.otherExpenseCost = this.totalAmountOther;
        //    this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseMaterialCost: any = 0;
  expenseServiceCost: any = 0;
  expenseManualCost: any = 0;
  prdeictionMaterialCost: any = 0;
  reduceItemTotalAmount: any = 0;
  predictionServiceCost: any = 0;
  predictionManualCost: any = 0;
  calculateAmountMaintainance() {
    this.expenseMaterialCost = 0;
    this.expenseServiceCost = 0;
    this.reduceItemTotalAmount = 0;
    this.prdeictionMaterialCost = 0;
    this.predictionServiceCost = 0;
    this.expenseManualCost = 0;
    this.predictionManualCost = 0;
    this.savedJobList?.forEach((savedJob: any) => {
      let job_expenseMaterialCost = 0;
      let job_expenseServiceCost = 0;
      let job_reduceItemTotalAmount = 0;
      savedJob?.expenseMaterialList?.forEach((f: any) => {
        this.expenseMaterialCost =
          this.expenseMaterialCost + Number(f?.total_expense);

        job_expenseMaterialCost =
          job_expenseMaterialCost + Number(f?.total_expense);
      });
      savedJob?.expenseServiceList?.forEach((f: any) => {
        this.expenseServiceCost =
          this.expenseServiceCost + Number(f?.total_expense);

        job_expenseServiceCost =
          job_expenseServiceCost + Number(f?.total_expense);
      });

      savedJob?.reduceItemList?.forEach((f: any) => {
        this.reduceItemTotalAmount =
          this.reduceItemTotalAmount + Number(f?.total_amount);

        job_reduceItemTotalAmount =
          job_reduceItemTotalAmount + Number(f?.total_amount);
      });
      savedJob.totalcost =
        Number(job_expenseMaterialCost) + Number(job_expenseServiceCost);
      savedJob.job_reduceItemTotalAmount = job_reduceItemTotalAmount;
      savedJob.finalCost =
        Number(savedJob.totalcost) - Number(job_reduceItemTotalAmount);
      let allMaintainance :any= [];
      savedJob?.expenseMaterialList?.forEach((f2: any) => {
        allMaintainance?.push(f2);
      });
      savedJob?.expenseServiceList?.forEach((f3: any) => {
        allMaintainance?.push(f3);
      });
      savedJob.allMaintainance = allMaintainance;
    });

    // this.expenseManualList.forEach((f: any) => {
    //   this.expenseManualCost =
    //     this.expenseManualCost + Number(f?.total_expense);
    // });

    this.maintainanaceCost =
      (this.expenseMaterialCost || 0) +
      (this.expenseServiceCost || 0) -
      (this.reduceItemTotalAmount || 0);
  }
  getServiceList(jobId: any, object: any) {
    let obj: any = this.share.getListObj(
      'repair_expense_costing',
      false,
      [],
      true
    );
    obj.tractor_id = jobId;

    this.api.postapi('getServiceExpense_cost', obj).subscribe(
      (res: any) => {
        // this.expenseServiceList = res?.data.filter(
        //   (f: any) => f?.expense_head == 'EXPENSE'
        // );
        object.expenseServiceList = res?.data.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );

        this.share.spinner.dismiss();
        this.calculateAmountMaintainance();
        this.combinedMaintainance();

        console.log('expenseServiceList', this.expenseServiceList);
        //   this.calculateAmount();
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseServiceList: any = [];
  prdeictionServiceList: any = [];
  // getServiceList() {
  //   let obj: any = this.share.getListObj('reparing_cost', false, [], true);
  //   obj.tractor_id = this.tractor_id;

  //   this.api.postapi('getServiceExpense', obj).subscribe(
  //     (res: any) => {
  //       this.expenseServiceList = res?.data.filter(
  //         (f: any) => f?.expense_head == 'EXPENSE'
  //       );
  //       this.prdeictionServiceList = res?.data.filter(
  //         (f: any) => f?.expense_head == 'PREDICTION'
  //       );
  //       this.share.spinner.dismiss();
  //       console.log('expenseServiceList', this.expenseServiceList);
  //       this.calculateAmountMaintainance();
  //       this.combinedMaintainance();

  //     },
  //     (error: any) => {}
  //   );
  // }
  expenseManualList: any = [];
  prdeictionManualList: any = [];
  getManualExpenseList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractor_id;

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
    // this.expenseManualList?.forEach((f: any) => {
    //   this.allMaintainance?.push(f);
    // });
  }
  async viewImage(imageGroup: any) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor_id,
        imageGroup: imageGroup,
        uploadPhoto: false,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async viewImageLive() {
    let imageArray: any = [];

    if (this.tractorDetails?.leftImageUrl) {
      imageArray.push({ imageUrlUrl: this.tractorDetails?.leftImageUrl });
    }
    if (this.tractorDetails?.rightImageUrl) {
      imageArray.push({ imageUrlUrl: this.tractorDetails?.rightImageUrl });
    }
    if (this.tractorDetails?.frontImageUrl) {
      imageArray.push({ imageUrlUrl: this.tractorDetails?.frontImageUrl });
    }
    if (this.tractorDetails?.backImageUrl) {
      imageArray.push({ imageUrlUrl: this.tractorDetails?.backImageUrl });
    }

    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor_id,
        imageGroup: null,
        uploadPhoto: false,
        imageArray: imageArray,
        callApi: false,
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
      this.rtoCost=Number(this.tractorDetails?.rto_cost||0) 
      this.insuranceCost=Number(this.tractorDetails?.insurance_cost||0) 
      this.getRTODataByID()
        this.getDataByIDSellData();
        this.getDataByIDFinance();
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  rtoData:any
   getRTODataByID(){
 
    let obj = this.share.getDataId(null, false, [], this.tractorDetails?.rtoDetailsId);
    this.api.postapi('getRTODetailsByID', obj).subscribe(
      (res:any) => {
        this.rtoData = res?.data;
    
   console.log("rtoData",this.rtoData);
   
    
      
      },
      (error:any) => {
        this.share.spinner.dismiss()
      }
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
