import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

@Component({
  selector: 'app-select-with-search',
  templateUrl: './select-with-search.component.html',
  styleUrls: ['./select-with-search.component.scss'],
})
export class SelectWithSearchComponent implements OnInit {
  itemName: any = 'State';
  otherObjects: any;
  table_name: any;
  list: any = [];
  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private share: ShareService
  ) {}
  search: any = {
    name: null,
  };
  ngOnInit() {}
  onInputFocus() {}
  focusOut() {}
  dismiss() {
    this.modalController.dismiss();
  }
  selectItem(val: any) {
    let data = this.list.find((f: any) => f.id == val?.detail?.value);
    this.modalController.dismiss(data);
  }
  addNewItem() {
    let sendObj: any={};
    if (Object.keys(this.otherObjects)?.length) {
      Object.keys(this.otherObjects)?.forEach((obj: any) => {
        sendObj[obj] = this.otherObjects[obj];
      });
    }
    sendObj.name = this.search.name;
    let obj = {
      src: this.table_name,
      data: sendObj,
    };
    this.share.showLoading('Adding');
    this.api.postapi('addOpp', obj).subscribe((res: any) => {
      // this.share.spinner.dismiss()
      // this.form.reset();
      console.log('res', res);
this.share.spinner.dismiss()
      this.modalController.dismiss(res?.rowData);
    });
  }
}
