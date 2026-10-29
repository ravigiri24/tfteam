import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private share: ShareService,
  ) {}

  ngOnInit() {
    this.getCashList();
  }

  getCashList() {
    this.loading = true;
    this.error = false;
    const obj: any = this.share.getListObj('bank', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.share.showLoading("Loading")
    this.api.postapi('getCashReceivingList', obj).subscribe({
      next: (res: any) => {
        this.cashHistory = res?.data || [];
        this.loading = false;
        this.share.spinner.dismiss()
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.share.spinner?.dismiss();
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

  receiptChanged() {
    this.changed = true;
    this.getCashList();
  }

  dismiss() {
    return this.modalCtrl.dismiss(this.changed);
  }
}
