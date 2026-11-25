import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { OutwardTransportComponent } from '../outward-transport/outward-transport.component';

@Component({
  selector: 'app-outward-history',
  templateUrl: './outward-history.component.html',
  styleUrl: './outward-history.component.scss'
})
export class OutwardHistoryComponent implements OnInit {
  private readonly backActions = [{ name: 'Back', icon: 'arrow-back-outline' }];
  private readonly addActions = [...this.backActions, { name: 'Add', icon: 'add-outline' }];
  headerDisplayArray = this.backActions;
  readonly fields = [
    { key: 'transport_start_date', label: 'Transport Start Date' },
    { key: 'transport_src_place', label: 'Transport Source Place' },
    { key: 'expectedReachDate', label: 'Expected Reach Date' },
    { key: 'reachDate', label: 'Reach Date' },
    { key: 'transportDestinationId', label: 'Destination Warehouse' },
    { key: 'remark', label: 'Remark' },
  ];
  history: any[] = [];
  warehouseNames = new Map<string, string>();
  loading = false;
  error = false;

  constructor(
    private api: ApiService,
    private share: ShareService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.loadHistory();
    this.api.postapi('getList', this.share.getListObj('warehouselocation', false, [], true)).subscribe({
      next: (res: any) => {
        for (const warehouse of res?.data ?? []) {
          this.warehouseNames.set(String(warehouse.id), warehouse.name);
        }
      },
      error: () => this.share.presentToast('Unable to load warehouse names.'),
    });
  }
tractorDetails:any
  loadHistory() {
    if (this.loading) return;
    this.loading = true;
    this.error = false;
    this.headerDisplayArray = this.backActions;
    const staff = JSON.parse(this.share.get_staff() || 'null');
   // staff.tractor_id=this.tractorDetails.id
    this.api.postapi('getOutwardHistoryByTractor', { tractor_id:this.tractorDetails.id,operate: staff?.staffCode, isLive: false }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.error = !Array.isArray(res?.data);
        const records = this.error ? [] : res.data;
        this.history = records.filter((tractor: any) =>
          tractor?.transport_start_date || tractor?.expectedReachDate || tractor?.reachDate,
        );
        if (!this.error && (!records.length || records[records.length - 1]?.isReached == 1)) {
          this.headerDisplayArray = this.addActions;
        }
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  async openModal(record?: any) {
    const modal = await this.modalCtrl.create({
      component: OutwardTransportComponent,
      cssClass: 'custom-modal',
      componentProps: {
        tractorDetails: this.tractorDetails,
        record,
        canChangeReached: !record || record === this.history[this.history.length - 1],
      },
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') this.loadHistory();
  }

  async actionEventHeader(action: { name: string }) {
    if (action.name === 'Back') {
      await this.close();
    } else if (action.name === 'Add' && this.headerDisplayArray === this.addActions) {
      await this.openModal();
    }
  }

  close() {
    return this.modalCtrl.dismiss(undefined, 'cancel');
  }
}
