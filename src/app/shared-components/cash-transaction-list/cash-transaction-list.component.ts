import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { DeleteCashReasonComponent } from '../delete-cash-reason/delete-cash-reason.component';

@Component({
  selector: 'app-cash-transaction-list',
  templateUrl: './cash-transaction-list.component.html',
  styleUrls: ['./cash-transaction-list.component.scss'],
})
export class CashTransactionListComponent {
  @Input() receipts: any[] = [];
  @Input() showTFCode = false;
  @Input() showCashHistoryButton = false;
  @Output() openCashHistory = new EventEmitter<any>();
  @Output() changed = new EventEmitter<void>();
  deletingId: any = null;

  constructor(private modalCtrl: ModalController, private api: ApiService, private share: ShareService) {}

  get totalCashReceived(): number {
    return this.receipts
      .filter(receipt => Number(receipt?.isDeleted) !== 1 && Number(receipt?.isReturned) !== 1)
      .reduce((total, receipt) => total + (Number(receipt?.cash_amount) || 0), 0);
  }

  returnReceipt(receipt: any) { return this.updateReceipt(receipt, 'return'); }
  deleteReceipt(receipt: any) { return this.updateReceipt(receipt, 'delete'); }

  private async updateReceipt(receipt: any, action: 'return' | 'delete') {
    if (Number(receipt.isDeleted) === 1 || Number(receipt.isReturned) === 1 || this.deletingId !== null) return;
    this.deletingId = receipt.id;
    try {
      const modal = await this.modalCtrl.create({
        component: DeleteCashReasonComponent,
        componentProps: { action },
        cssClass: 'delete-cash-reason-sheet',
        breakpoints: [0, 1], initialBreakpoint: 1, handle: true,
      });
      await modal.present();
      const { data, role } = await modal.onDidDismiss();
      const reason = data?.[action === 'return' ? 'returnReason' : 'deletedReason']?.trim();
      if (role !== 'confirm' || !reason) { this.deletingId = null; return; }
      const staff = JSON.parse(this.share.get_staff() || 'null');
      const update = action === 'return'
        ? { isReturned: true, returnReason: reason }
        : { isDeleted: true, deletedDate: new Date(), deletedBy: staff?.id, deletedReason: reason };
      this.api.postapi('updateOpp', { src: 'cash_receving', id: receipt.id, data: update }).subscribe({
        next: () => {
          Object.assign(receipt, update);
          this.deletingId = null;
          this.share.presentToast(action === 'return' ? 'Cash returned successfully.' : 'Removed Successfully...');
          this.changed.emit();
        },
        error: () => {
          this.deletingId = null;
          this.share.presentToast('Unable to update receipt. Please try again.');
        },
      });
    } catch {
      this.deletingId = null;
      this.share.presentToast('Unable to open receipt action. Please try again.');
    }
  }
}
