import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaterialListComponent } from '../material-list/material-list.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { AddRepairStatusComponent } from '../add-repair-status/add-repair-status.component';
import { AddServiceChargeComponent } from '../add-service-charge/add-service-charge.component';
import { FinishRepairDialogComponent } from '../finish-repair-dialog/finish-repair-dialog.component';
import { AddMaunalChargeComponent } from '../add-maunal-charge/add-maunal-charge.component';
@Component({
  selector: 'app-repair-tractor-dashboard',
  templateUrl: './repair-tractor-dashboard.component.html',
  styleUrls: ['./repair-tractor-dashboard.component.scss'],
})
export class RepairTractorDashboardComponent implements OnInit {
  tractorDetails: any;
  updateTranctorStatus:any=true
  constructor(
    private modalControl: ModalController,
    private modalCtrl: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.getMaterialList();
    this.getServiceList();
    this.getManualExpenseList();
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  expenseManualList:any=[]
  prdeictionManualList:any=[]
  getManualExpenseList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
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
        this.calculateAmount();
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseServiceList: any = [];
  prdeictionServiceList: any = [];
  getServiceList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
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
        this.calculateAmount();
        // this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseMaterialList: any = [];
  prdeictionMaterialList: any = [];
  getMaterialList() {
    let obj: any = this.share.getListObj('reparing_cost', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.share.showLoading('Fetching Data...');
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

        this.share.spinner.dismiss();
        this.calculateAmount();
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
  calculateAmount() {
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
  }
  addStatus(tractor: any) {
    this.showModal(tractor?.id);
  }
    async showModal(tractor_id: any = null) {
      const modal = await this.modalCtrl.create({
        component: AddRepairStatusComponent,
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
  openServiceEdit(ser: any = null, expense_head: any = null) {
    let obj: any = {};
    obj.expense_date = ser?.expense_date;
    obj.expense_id = ser?.expense_id;
    obj.repairing_center = ser?.repairing_center;
    obj.billNumber = ser?.billNumber;
    obj.id = ser?.id;

    this.addService(expense_head, obj);
  }
  openManualEdit(ser: any = null, expense_head: any = null) {
    let obj: any = {};
    obj.expense_date = ser?.expense_date;
    obj.expense_amount = ser?.expense_amount;
    obj.expense_id = ser?.expense_id;
    obj.repairing_center = ser?.repairing_center;
    obj.billNumber = ser?.billNumber;
    obj.id = ser?.id;

    this.addManualExpense(expense_head, obj);
  }
  openEdit(mat: any = null, expense_head: any = null) {
    let obj: any = {};
    obj.expense_date = mat?.expense_date;
    obj.repairing_center = mat?.repairing_center;
    obj.billNumber = mat?.billNumber;
    let getMaterialOfBill = [];
    if (expense_head == 'EXPENSE') {
      getMaterialOfBill = this.expenseMaterialList.filter(
        (f: any) => f.billNumber == mat.billNumber
      );
    } else if (expense_head == 'PREDICTION') {
      getMaterialOfBill = this.prdeictionMaterialList.filter(
        (f: any) => f.billNumber == mat.billNumber
      );
    }
    obj.checkedList = getMaterialOfBill;
    this.materalManagement(expense_head, obj);
  }
  async addService(expense_head: any, obj: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddServiceChargeComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.getServiceList();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async addManualExpense(expense_head: any, obj: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddMaunalChargeComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.getManualExpenseList();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async materalManagement(expense_head: any, obj: any = null) {
    const modal = await this.modalCtrl.create({
      component: MaterialListComponent,
      componentProps: {
        tractorDetails: this.tractorDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    this.getMaterialList();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  goToPage(type: any) {
    this.selectedTab = type;
  }
  selectedTab: any = 'EXPENSE';
 async readyConfirmation(tractor:any){
   const modal = await this.modalCtrl.create({
        component: FinishRepairDialogComponent,
        componentProps: {
          tractorDetails: tractor,
          updateTranctorStatus:this.updateTranctorStatus
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
      
       this.dismiss()
      }
      this.getTractorDetails()
  }
  staffDetails:any
  getTractorDetails(msg: any = 'Refreshing Data...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      tractor_id: this.tractorDetails?.id,
    };
    this.share.showLoading(msg);
    this.api.postapi('getTractorById', obj).subscribe(
      (res: any) => {
        this.tractorDetails = res?.data;
      
        this.share.spinner.dismiss();
     
      },
      (error: any) => {}
    );
  }
}
