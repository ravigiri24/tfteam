import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from '../crud-popup/crud-popup.component';
import { ModalController } from '@ionic/angular';
import { SelectWithSearchComponent } from '../select-with-search/select-with-search.component';
@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  @Input() typePurchaseList: any = [];
  @Input() companyRepresentativeList: any = [];
  @Input() cityList: any = [];
  @Input() dealer_list: any = [];
  @Input() data: any;
  @Input() dealerName: any;
  @Input() modelForm: FormGroup;
  @Output() saveFormEvent = new EventEmitter();
  @Output() callListApi = new EventEmitter();
  constructor(
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {}
  saveForm() {
    this.saveFormEvent.emit();

  }
  @Input() listColorClass = 'sevenColor';
  async openCrudManagement(type: any) {
    const modal = await this.modalCtrl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    this.refreshList(type);
    console.log('role', role);
  }
  refreshList(type: any) {
    this.callListApi.emit(type);
  }

  async selectItem(list: any, itemName: any, table_name: any) {
    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
        otherObjects: null,
        jsonKey: 'name',
        search: {
          name: null,
        },
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      let purchasedetail = this.modelForm.controls[
        'purchasedetail'
      ] as FormGroup;
      purchasedetail.controls['dealer_id'].setValue(data?.id);

      this.dealerName = data?.name;
      this.resetOtherValue()
    }

    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  resetOtherValue(){
    // if(this.dealerName!='Other'){
    // let purchasedetail = this.modelForm.controls[
    //     'purchasedetail'
    //   ] as FormGroup;
    //   purchasedetail.controls['nameOfSeller'].setValue(null);
    //   purchasedetail.controls['address'].setValue(null);
    //   purchasedetail.controls['contact1'].setValue(null);
    // }
  }

}
