import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-added-service-item-list',
  templateUrl: './added-service-item-list.component.html',
  styleUrls: ['./added-service-item-list.component.scss'],
})
export class AddedServiceItemListComponent {
  @Input() addedItems: any[] = [];
  @Input() listColorClass = 'secondColor';

  constructor(private modalControl: ModalController) {}

  dismiss() {
    this.modalControl.dismiss();
  }

  getItemName(item: any) {
    return (
      item?.materialDetail?.name ||
      item?.expenseDetail?.name ||
      item?.expenseType?.name ||
      item?.name ||
      item?.expense_name ||
      'Service'
    );
  }

  getItemAmount(item: any) {
    return item?.expense_amount || item?.total_expense || item?.amount || 0;
  }
}
