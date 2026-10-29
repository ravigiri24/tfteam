import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TractorCashHistoryComponent } from 'src/app/finance-department/finance-dashboard/store-wise-cash/tractor-cash-history/tractor-cash-history.component';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-transaction-history-account',
  templateUrl: './transaction-history-account.component.html',
  styleUrls: ['./transaction-history-account.component.scss'],
})
export class TransactionHistoryAccountComponent implements OnInit {
  constructor(private api: ApiService, public share: ShareService, private router: Router, private modalCtrl: ModalController) {}
  ngOnInit() {}

  async openTractorCashHistory(receipt: any) {
    if (!receipt?.tractor_id) return;
    const modal = await this.modalCtrl.create({
      component: TractorCashHistoryComponent,
      cssClass: 'midium-model',
      componentProps: {
        tractorDetails: {
          id: receipt.tractor_id,
          registractionNo: receipt.TFCode,
          name: receipt.tractorName,
        },
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) this.loadTransactions();
  }
  cashHistory: any[] = [];
  private loadedTransactions: any[] = [];
  selectedStore: any;
  warehouseList: any[] = [];
  error = false;
  headerDisplayArray = [{ name: 'Back', icon: 'arrow-back-outline' }];

  dateFilterMode: 'month' | 'range' = 'month';
  financialYearLabel = '';
  financialYearMonths: { value: string; label: string; startDate: string; endDate: string }[] = [];
  selectedMonth = '';
  startDate = '';
  endDate = '';
  dateFilterError = '';

  initializeDateFilters(now = new Date()) {
    const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    this.financialYearLabel = `${startYear}-${startYear + 1}`;
    this.financialYearMonths = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(startYear, index + 3, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return {
        startDate: `${monthKey}-01`,
        endDate: `${monthKey}-${String(lastDay).padStart(2, '0')}`,
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      };
    });
    this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    this.dateFilterMode = 'month';
    this.updateSelectedMonthDates();
    this.dateFilterError = '';
  }

  updateSelectedMonthDates() {
    const month = this.financialYearMonths.find(item => item.value === this.selectedMonth);
    this.startDate = month?.startDate || '';
    this.endDate = month?.endDate || '';
  }

  applyDateFilters() {
    if (this.dateFilterMode === 'month') this.updateSelectedMonthDates();
    this.dateFilterError = '';
    if (this.dateFilterMode === 'range') {
      if (!this.startDate || !this.endDate) {
        this.dateFilterError = 'Choose both From and To dates.';
      } else if (this.startDate > this.endDate) {
        this.dateFilterError = 'To date must be on or after From date.';
      }
    }
    // Reapply all filters to the original loaded store list, including pagination.
    this.cashHistory = this.filterBySelectedDates(this.loadedTransactions);
  }

  fetchingTransactions = false;

  loadTransactions() {
    this.applyDateFilters();
    if (this.dateFilterError || !this.startDate || !this.endDate || !this.selectedStore || this.fetchingTransactions) return;
    this.getAllTractorListStorewise(true);
  }

  filterBySelectedDates(list: any[]): any[] {
    if (this.dateFilterError) return [];
    return list.filter(item => {
      const value = item?.received_date;
      if (!value) return false;
      const text = String(value);
      let dateKey: string;
      if (/^\d{4}-\d{2}-\d{2}(?:$|[T ])/.test(text)) {
        dateKey = text.slice(0, 10);
      } else {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      return !!this.startDate && !!this.endDate && dateKey >= this.startDate && dateKey <= this.endDate;
    });
  }


  ionViewWillEnter() {
    this.initializeDateFilters();
    this.getWareHouseList();
  }

  getWareHouseList() {
    const staff = JSON.parse(this.share.get_staff() || 'null');
    const obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = staff?.storeId;
    this.api.postapi('getList', obj).subscribe({
      next: (res: any) => {
        this.warehouseList = [...(res?.data || [])].reverse();
        this.share.putUnAssignedInWareHouse(this.warehouseList);
        this.share.putAllInWareHouse(this.warehouseList);
        this.selectedStore = this.warehouseList[0]?.id;
        if (this.selectedStore) this.loadTransactions();
      },
      error: () => { this.error = true; this.share.presentToast('Unable to load stores. Please try again.'); },
    });
  }

  tractorListStorewise(event: any) {
    this.selectedStore = event?.selectedStore;
    this.loadTransactions();
  }

  getAllTractorListStorewise(loader = false) {
    if (this.fetchingTransactions || !this.selectedStore) return;
    const staff = JSON.parse(this.share.get_staff() || 'null');
    this.fetchingTransactions = true;
    this.error = false;
    this.api.postapi('getTransactionListByStoreByDate', {
      operate: staff?.staffCode,
      store_id: this.selectedStore,
      startDate: this.startDate,
      endDate: this.endDate,
    }).subscribe({
      next: (res: any) => {
        this.loadedTransactions = res?.data || [];
        this.cashHistory = this.filterBySelectedDates(this.loadedTransactions);
        this.fetchingTransactions = false;
      },
      error: () => {
        this.fetchingTransactions = false;
        this.error = true;
        this.share.presentToast('Unable to load transactions. Please try again.');
      },
    });
  }

  actionEventHeader(event: any) {
    if (event?.name === 'Back') this.backToList();
  }
  backToList() { return this.router.navigate(['/account-department/account-dashboard']); }
}
