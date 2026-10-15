import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { AddCashTractorComponent } from 'src/app/shared-components/add-cash-tractor/add-cash-tractor.component';

@Component({
  selector: 'app-tractor-cash-history',
  templateUrl: './tractor-cash-history.component.html',
  styleUrls: ['./tractor-cash-history.component.scss'],
})
export class TractorCashHistoryComponent implements OnInit {
  @Input() tractorDetails: any;
  cashHistory: any[] = [];
  loading = false;
  error = false;
  changed = false;
  deletingId: any = null;
  private staffDetails: any;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private api: ApiService,
    private share: ShareService,
  ) {}

  ngOnInit() {
    this.staffDetails = JSON.parse(this.share.get_staff() || 'null');
    this.getCashList();
  }

  get totalCashReceived(): number {
    return this.cashHistory
      .filter(receipt => Number(receipt?.isDeleted) !== 1)
      .reduce((total, receipt) => total + (Number(receipt?.cash_amount) || 0), 0);
  }

  getCashList() {
    this.loading = true;
    this.error = false;
    const obj: any = this.share.getListObj('bank', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.api.postapi('getCashReceivingList', obj).subscribe({
      next: (res: any) => {
        this.cashHistory = res?.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  async addReceipt() {
    const modal = await this.modalCtrl.create({
      component: AddCashTractorComponent,
      cssClass: 'light-modal',
      componentProps: { tractor: this.tractorDetails },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.changed = true;
      this.getCashList();
    }
  }

  async deleteReceipt(receipt: any) {
    if (Number(receipt.isDeleted) === 1 || this.deletingId !== null) return;
    const alert = await this.alertCtrl.create({
      header: 'Delete This Transaction',
      message: 'Are You Sure',
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Yes', role: 'confirm' }],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') return;
    this.deletingId = receipt.id;
    this.api.postapi('updateOpp', {
      src: 'cash_receving',
      id: receipt.id,
      data: { isDeleted: true, deletedDate: new Date(), deletedBy: this.staffDetails?.id },
    }).subscribe({
      next: () => {
        this.deletingId = null;
        this.changed = true;
        this.share.presentToast('Removed Successfully...');
        this.getCashList();
      },
      error: () => {
        this.deletingId = null;
        this.share.presentToast('Unable to delete receipt. Please try again.');
      },
    });
  }

  dismiss() {
    return this.modalCtrl.dismiss(this.changed);
  }
}
