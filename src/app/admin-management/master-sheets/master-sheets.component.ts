import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-master-sheets',
  templateUrl: './master-sheets.component.html',
  styleUrls: ['./master-sheets.component.scss'],
})
export class MasterSheetsComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    (window as any).pdfMake.vfs = pdfMake.vfs;
    pdfMake.fonts = {
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };
  }
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
    });
    console.log('this.dateForm', this.form.value);
  }
  form: FormGroup;
  dismiss() {
    return this.modalCtrl.dismiss(null);
  }
  generateExcel() {
    // Get the HTML content of the div you want to export
    const element = document.getElementById('contentReport');

    // Create a worksheet from the table
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    // Create a new workbook with the generated worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write the workbook as a binary string
    const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob object from the binary data
    const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Create a link to trigger the download
    // const link = document.createElement('a');
    //    link.href = URL.createObjectURL(blob);
    //  link.download = 'generated_file.xlsx'; // Name of the file to be downloaded
    this.convertBlobToBase64(blob, 'xlsx');
    // Trigger the link click to download the file
    // link.click();
  }
  srcPage: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if (this.form) {
      this.form.reset();
    }
    this.getLogisticExpense();
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
    this.initialize();
  }
  allDetails: any;
  tractorArray: any;
  genrateReport() {
    if (this.form.valid) {
      if (
        this.form.controls['startDate']?.value <=
        this.form.controls['endDate']?.value
      ) {
        let obj: any = this.share.getListObj(
          'getTractorSheetByDate',
          false,
          [],
          true
        );

        obj.startDate = this.form.controls['startDate'].value;
        obj.endDate = this.form.controls['endDate'].value;

        this.share.showLoading('Fetching Report...');
        this.reportDatesRecord = obj;
        this.api.postapi('getTractorSheetByDate', obj).subscribe(
          (res: any) => {
            this.allDetails = res?.data;
            this.tractorArray = res?.data?.tractorList;
            this.tractorArray?.forEach((tractor: any) => {
              let logisticExpense: any = {};
              let totalAmountBreakup = 0;

              this.logisticExpenseTypeList?.forEach((log: any) => {
                let haveExpense = tractor?.transportCosting?.find(
                  (f: any) => f.expense_id == log?.id
                );

                if (haveExpense) {
                  totalAmountBreakup =
                    Number(totalAmountBreakup) + Number(haveExpense?.expense_amount);
                  logisticExpense[log?.name] = haveExpense?.expense_amount;
                } else {
                  logisticExpense[log?.name] = 0;
                }
              
                tractor.logisticExpense = logisticExpense;
              });
                console.log('logisticExpense', logisticExpense);
                if(tractor?.purchasedetail?.purchasePrice>0){
               totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.purchasedetail?.purchasePrice)
                }
                if(tractor?.rtoDetails){
                if(tractor?.rtoDetails?.rto_cost>0){
                  totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.rtoDetails?.rto_cost)
                }
                   if(tractor?.rtoDetails?.insurance_cost>0){
                  totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.rtoDetails?.insurance_cost)
                } 
                }
                tractor.totalAmountBreakup=totalAmountBreakup
            });
            // this.createReport();
            this.share.spinner.dismiss();
          },
          (error: any) => {}
        );
      } else {
        this.share.presentToast('Error:End Date is less than Start Date');
      }
    } else {
      this.share.presentToast('Error:Please Fill Required(*) Fields');
    }
  }

  logisticExpenseTypeList: any = [];
  getLogisticExpense() {
    let obj: any = this.share.getListObj('expensetype', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.logisticExpenseTypeList = res.data;
      },
      (error: any) => {}
    );
  }
  ngOnInit() {}
  private convertBlobToBase64 = (blob: Blob, extension: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);

        this.renderResult = reader.result;
        this.saveDataTo(extension);
        console.log('reader.result', reader.result);
      };
      reader.readAsDataURL(blob);
    });
  staffDetails: any;
  renderResult: any;
  reportDatesRecord: any;
  printData: any;
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
  saveDataTo(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,

      actionByid: this.staffDetails?.id,
      report_type: 'MASTER_SHEET',
      extension: extension,
      reparing_center: this.staffDetails?.repair_center,
      startDate: this.reportDatesRecord?.startDate,
      endDate: this.reportDatesRecord?.endDate,
    };
    console.log('convertBlobToBase64', obj);

    this.api.postapi('saveReportPdf', obj).subscribe((res: any) => {
      console.log('saveDataTo', res);
      this.share.spinner.dismiss();
      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res?.data?.imageUrlUrl;
        this.openPDF(res?.data?.imageUrlUrl);
      }
    });
  }
  pdfUrl: any;
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    // this.error = dataUrl;
    browser.show();
  }
}
