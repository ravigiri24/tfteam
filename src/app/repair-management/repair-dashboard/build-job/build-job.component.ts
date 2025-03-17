import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddServiceChargeComponent } from './add-service-charge/add-service-charge.component';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { AddMaterialExpenseComponent } from './add-material-expense/add-material-expense.component';
@Component({
  selector: 'app-build-job',
  templateUrl: './build-job.component.html',
  styleUrls: ['./build-job.component.scss'],
})
export class BuildJobComponent implements OnInit {
  @Input() jobDetails: any;
  @Input() expenseServiceList: any;
  @Input() expenseMaterialList: any = [];
  @Input() prdeictionMaterialList: any = [];
  @Input() isJobDone: any =false
  @Output() refreshServiceList = new EventEmitter();
  @Output() refreshMaterailList = new EventEmitter();
  constructor(
    private alertCtrl: AlertController,
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}

  selectedTab: any = 'SERVICE';

  jobId: any;
  ngOnInit() {}
  goToPage(tab: any) {
    this.selectedTab = tab;
  }

  addParts() {}
  async addService(expense_head: any, obj: any = null) {
    const modal = await this.modalControl.create({
      component: AddServiceChargeComponent,
      componentProps: {
        tractorDetails: this.jobDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
    this.refreshServiceList.emit();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  async addMaterial(expense_head: any, obj: any = null, type: any = 'SERVICE') {
    const modal = await this.modalControl.create({
      component: AddMaterialExpenseComponent,
      componentProps: {
        tractorDetails: this.jobDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
   // if (type == 'SERVICE') {
    //  this.refreshServiceList.emit();
    //} else {
      this.refreshMaterailList.emit();
  //  }
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
  openServiceEdit(ser: any = null, expense_head: any = null) {
    let obj: any = {};

    obj.expense_id = ser?.expense_id;
    obj.repairing_center = ser?.repairing_center;
    obj.billNumber = ser?.billNumber;
    obj.expense_amount = ser?.expense_amount;
    obj.id = ser?.id;

    this.addService(expense_head, obj);
  }
  openEdit(mat: any = null, expense_head: any = null) {
    let obj: any = {};

    obj.expense_id = mat?.expense_id;
    obj.repairing_center = mat?.repairing_center;
    obj.expense_amount = mat?.expense_amount;
    obj.id = mat?.id;

    obj.qty = mat?.qty;
    obj.billNumber = mat?.billNumber;
    obj.repairing_center = mat?.repairing_center;

    this.addMaterial(expense_head, obj, 'MATERIAL');
  }

  async deleteItem(mat: any,text:any='Delete Spare') {
    const alert = await this.alertCtrl.create({
      header: text,
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
      this.deleteMaterialApi(mat,text);
    }
  }
 
  deleteMaterialApi(mat: any,text:any) {
    let obj = {
      src: 'repair_expense_costing',
      data: { isDeleted: true },
      id: mat?.id,
    };

    this.share.showLoading('Deleting Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Deleted Successfully...');
      if(text=='Delete Spare'){
        this.refreshMaterailList.emit();
      }
 else{
  this.refreshServiceList.emit();
 }
    });
  }
}
