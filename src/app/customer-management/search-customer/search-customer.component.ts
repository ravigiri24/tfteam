import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss'],
})
export class SearchCustomerComponent  implements OnInit {
tractor_id:any
  constructor(private modalControl:ModalController) { }
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  ngOnInit() {}
  salva(){
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById('table'));
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook,worksheet,'calib');
      XLSX.writeFile(workbook,'calib' + this.EXCEL_EXTENSION);
      console.log(worksheet)
  }
  dismiss() {
    this.modalControl.dismiss();
  }
}
