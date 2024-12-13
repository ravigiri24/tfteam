import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ShareService } from 'src/app/share.service';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddCostComponent } from '../add-cost/add-cost.component';
@Component({
  selector: 'app-transport-cost-list',
  templateUrl: './transport-cost-list.component.html',
  styleUrls: ['./transport-cost-list.component.scss'],
})
export class TransportCostListComponent implements OnInit {
  @ViewChild(IonModal) modalCost: IonModal;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}
  form: FormGroup;
  data: any;
  tarctor_id: any;
  ionViewWillLeave() {
    //this.modalCost.dismiss()
    if (this.modalCost) {
      this.modalCost.canDismiss;
    }
  }
  async showModal(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: AddCostComponent,
      componentProps: {
        expenseTypeList: this.expenseTypeList,
        data: dataUpdate,
        tarctor_id: this.tarctor_id,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   this.getList()
    }
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  showAdd = true;
  ionViewWillEnter() {
    this.showAdd = false;
    setTimeout(() => {
      this.showAdd = true;
    }, 0);
    this.activatedRoute.params.subscribe((params: any) => {
      this.tarctor_id = params?.id;
    });

    this.listData = [];

    this.initialize();

    this.getList();
    this.getExpense();
  }
  cancel() {
    this.modalCost.dismiss(null, 'cancel');
  }
  dataClear() {
    this.editData = null;
    this.form.reset();
  }
  backToTansport() {
    this.router.navigate(['operational/transport-management']);
  }
  openEdit(row: any, ind: any) {
    let name = 'open-modal-cost' + this.tarctor_id;
    document.getElementById('open-modal-cost')?.click();
    this.editData = row;
    this.initialize(this.editData);
  }
  editData: any;
  updateItem() {
    this.form.controls['tractor_id'].setValue(this.tarctor_id);
    if (this.form.valid) {
      let obj = {
        src: 'transport_cost',
        data: this.form.value,
        id: this.editData?.id,
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.form.reset();
        this.cancel();
        this.getList();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  saveExpense() {
    this.form.controls['tractor_id'].setValue(this.tarctor_id);
    if (this.form.valid) {
      let obj = {
        src: 'transport_cost',
        data: this.form.value,
      };
      this.share.showLoading('Saving');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Expense Added Successfully');
        this.share.spinner.dismiss();
        this.form.reset();
        this.cancel();
        this.getList();
        //this.view='LIST'
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  initialize(data: any = null) {
    this.form = this.formBuilder.group({
      expense_id: new FormControl(data?.expense_id || null, [
        Validators.required,
      ]),
      expense_amount: new FormControl(data?.expense_amount || null, [
        Validators.required,
      ]),
      expense_date: new FormControl(data?.expense_date || null),
      tractor_id: new FormControl(this.tarctor_id || null, [
        Validators.required,
      ]),
    });
    console.log(' this.form', this.form);

    // if(data){
    //   this.form.addControl(
    //     'id',
    //     new FormControl(data?.id || null, [Validators.required])
    //   );
    // }
  }
  message: any;
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  listData: any;
  totalAmount = 0;
  getList() {
    let obj: any = this.share.getListObj('transport_cost', false, [], true);
    obj.tractor_id = this.tarctor_id;
    this.share.showLoading('Loading...');
    this.api.postapi('getTransportDetailsById', obj).subscribe(
      (res: any) => {
        this.listData = res.data;
     
     
        this.listData.reverse();
        this.totalAmount = 0;
        this.listData?.forEach((f: any) => {
          this.totalAmount =
            Number(this.totalAmount) + Number(f?.expense_amount);
        });
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  expenseTypeList: any = [];
  getExpense() {
    let obj: any = this.share.getListObj('expensetype', false, [], true);
    obj.tractor_id = this.tarctor_id;
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.expenseTypeList = res.data;
      },
      (error: any) => {}
    );
  }
}
