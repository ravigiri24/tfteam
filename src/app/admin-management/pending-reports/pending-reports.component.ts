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

import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-pending-reports',
  templateUrl: './pending-reports.component.html',
  styleUrls: ['./pending-reports.component.scss'],
})
export class PendingReportsComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
  form: FormGroup;
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
    });
    console.log('this.dateForm', this.form.value);
  }
  staffDetails: any;
  srcPage: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if (this.form) {
      this.form.reset();
    }
    this.allDetails = null;
    this.tractorArray = [];
    this.showData = false;
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
    this.initialize();
  }
  ngOnInit() {}
  tractorArray: any = [];
  allDetails: any;
  reportDatesRecord: any;
  genrateReport() {
    this.showData = false;
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
        this.api.postapi('getTractorPendingSheetByDate', obj).subscribe(
          (res: any) => {
            this.allDetails = res?.data;

            this.tractorArray = res?.data?.tractorList;
            this.tractorArray?.forEach((tractor: any) => {
              // tractor_status
              if (tractor?.tractor_status) {
                tractor.tractor_position = tractor?.tractor_status;
              } else {
                if (tractor?.isDraft == 1 && tractor?.tractor_status == null) {
                  tractor.tractor_position = 'BUFFER';
                } else if (
                  tractor?.isDraft == 0 &&
                  tractor?.isLive == 1 &&
                  tractor?.tractor_status == null
                ) {
                  tractor.tractor_position = 'LIVE';
                } else {
                  tractor.tractor_position = null;
                }
              }
              //finance

              if (tractor?.financeDetailedId > 0) {
                tractor.financeStatus = 'FINANCED';
              } else if (
                (tractor?.financeDetailedId == null ||
                  tractor?.financeDetailedId == undefined) &&
                tractor?.sellingDetailedIdDetails?.isFinance == 1
              ) {
                tractor.financeStatus = 'NOT_AVAILAIBLE';
              } else if (
                tractor?.sellingDetailedId > 0 &&
                (tractor?.financeDetailedId == null ||
                  tractor?.financeDetailedId == undefined) &&
                (tractor?.sellingDetailedIdDetails?.isFinance == 0 ||
                  tractor?.sellingDetailedIdDetails?.isFinance == null)
              ) {
                tractor.financeStatus = 'NOT_REQUIRED';
              } else {
                tractor.financeStatus = 'TRACTOR_NOT_SOLD';
              }
              // RTO

              if (tractor?.rtoDetailsId > 0) {
                tractor.rtoStatus = 'AVAILAIBLE';
              } else if (
                (tractor?.rtoDetailsId == null ||
                  tractor?.rtoDetailsId == undefined) &&
                tractor?.sellingDetailedId > 0
              ) {
                tractor.rtoStatus = 'NOT_AVAILAIBLE';
              } else if (
                tractor?.sellingDetailedId == null ||
                tractor?.sellingDetailedId == undefined ||
                tractor?.sellingDetailedId == 0
              ) {
                tractor.rtoStatus = 'TRACTOR_NOT_SOLD';
              }
              //MAPPED
              if (tractor?.repairMappedData?.length > 0) {
                tractor.mapStatus = 'MAPPED';
              } else if (
                tractor?.repairMappedData?.length == 0 &&
                tractor?.tractor_status != 'NEW_ARRIVAL' &&
                tractor?.tractor_status != 'AT_TRANSPORT'
              ) {
                tractor.mapStatus = 'NOT_MAPPED';
              } else if (
                (tractor?.repairMappedData?.length == 0 &&
                  tractor?.tractor_status == 'NEW_ARRIVAL') ||
                tractor?.tractor_status == 'AT_TRANSPORT'
              ) {
                tractor.mapStatus = 'NEW_ARRIVALS/AT_TRANSPORT';
              }
            });
            this.calcualteEntrySummary();
            // this.createReport();
            console.log('tractorArray', this.tractorArray);

            this.share.spinner.dismiss();
            setTimeout(() => {
              this.showData = true;
            }, 0);
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
  tfAvailaible = 0;
  tfNotAvailaible = 0;
  purchasePriceAvaialible = 0;
  purchasePriceNotAvaialible = 0;
  newArrivals = 0;
  logistic = 0;
  buffer = 0;
  archvied = 0;
  live = 0;
  locationAlloted: any = 0;
  locationNotAlloted: any = 0;
  transportCostingEntered = 0;
  transportCostingNotEntered = 0;
  mappedWIthRepair = 0;
  notMappedWithRepair = 0;
  salesDetailsAvailaivle = 0;
  salesDetailsNotAvailaivle = 0;
  financed = 0;
  notFinanced = 0;
  financedNotRequired = 0;
  rtodetailsAvail = 0;
  rtoDetailsNotAvail = 0;
  rrtoDetailsNotRequired = 0;

  calcualteEntrySummary() {
    this.tfAvailaible = 0;
    this.tfNotAvailaible = 0;
    this.tfAvailaible = this.tractorArray.filter(
      (f: any) =>
        f.registractionNo != null &&
        f.registractionNo != undefined &&
        f.registractionNo != 'NA'
    )?.length;
    this.tfNotAvailaible = this.tractorArray.filter(
      (f: any) =>
        f.registractionNo == null ||
        f.registractionNo == undefined ||
        f.registractionNo == 'NA'
    )?.length;

    //purchasePriceAvaialible
    this.purchasePriceAvaialible = 0;
    this.purchasePriceNotAvaialible = 0;
    this.purchasePriceAvaialible = this.tractorArray.filter(
      (tractor: any) => tractor?.purchasedetail?.purchasePrice > 0
    )?.length;
    this.purchasePriceNotAvaialible = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.purchasedetail?.purchasePrice == null ||
        tractor?.purchasedetail?.purchasePrice == undefined ||
        tractor?.purchasedetail?.purchasePrice == 0
    )?.length;

    //status
    this.newArrivals = 0;
    this.logistic = 0;
    this.buffer = 0;
    this.archvied = 0;
    this.live = 0;
    this.locationAlloted = 0;

    this.locationNotAlloted = 0;

    this.newArrivals = this.tractorArray.filter(
      (tractor: any) => tractor?.tractor_status == 'NEW_ARRIVAL'
    )?.length;
    this.logistic = this.tractorArray.filter(
      (tractor: any) => tractor?.tractor_status == 'AT_TRANSPORT'
    )?.length;
    this.buffer = this.tractorArray.filter(
      (tractor: any) => tractor?.isDraft == 1 &&  tractor?.isLive == 1 && tractor?.tractor_status == null
    )?.length;
        this.archvied = this.tractorArray.filter(
      (tractor: any) => tractor?.isDraft == 1  &&  tractor?.isLive == 1 && tractor?.tractor_status == 'ARCHIVED'
    )?.length;
    this.live = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.isDraft == 0 &&
        tractor?.isLive == 1 &&
        tractor?.tractor_status == null
    )?.length;
    this.locationNotAlloted = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.isLive == 1 &&
        (tractor?.tractordetailadmin?.wareHouseLocation == null ||
          tractor?.tractordetailadmin?.wareHouseLocation == undefined ||
          tractor?.tractordetailadmin?.wareHouseLocation == 0)
    )?.length;

    this.locationAlloted = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.isLive == 1 &&
        tractor?.tractordetailadmin?.wareHouseLocation > 0
    )?.length;

    //tranport
    this.transportCostingEntered = 0;
    this.transportCostingNotEntered = 0;
    this.transportCostingEntered = this.tractorArray.filter(
      (tractor: any) => tractor?.transportCosting?.length > 0
    )?.length;

    this.transportCostingNotEntered = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.transportCosting?.length <= 0 &&
        tractor?.tractor_status != 'NEW_ARRIVAL'
    )?.length;

    //repair
    this.mappedWIthRepair = 0;
    this.mappedWIthRepair = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.repairMappedData?.length > 0 &&
        tractor?.tractor_status != 'NEW_ARRIVAL' &&
        tractor?.tractor_status != 'AT_TRANSPORT'
    )?.length;

    this.notMappedWithRepair = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.repairMappedData?.length == 0 &&
        tractor?.tractor_status != 'NEW_ARRIVAL' &&
        tractor?.tractor_status != 'AT_TRANSPORT'
    )?.length;

    //sales
    this.salesDetailsAvailaivle = 0;
    this.salesDetailsNotAvailaivle = 0;
    this.salesDetailsAvailaivle = this.tractorArray.filter(
      (tractor: any) => tractor?.sellingDetailedId > 0
    )?.length;

    this.salesDetailsNotAvailaivle = this.tractorArray.filter(
      (tractor: any) =>
        (tractor?.sellingDetailedId == null ||
          tractor?.sellingDetailedId == undefined) &&
        tractor?.tractor_status != 'NEW_ARRIVAL' &&
        tractor?.tractor_status != 'AT_TRANSPORT'
    )?.length;

    this.financed = this.tractorArray.filter(
      (tractor: any) => tractor?.financeDetailedId > 0
    )?.length;

    this.notFinanced = this.tractorArray.filter(
      (tractor: any) =>
        (tractor?.financeDetailedId == null ||
          tractor?.financeDetailedId == undefined) &&
        tractor?.sellingDetailedIdDetails?.isFinance == 1
    )?.length;

    this.financedNotRequired = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.sellingDetailedId > 0 &&
        (tractor?.financeDetailedId == null ||
          tractor?.financeDetailedId == undefined) &&
        (tractor?.sellingDetailedIdDetails?.isFinance == 0 ||
          tractor?.sellingDetailedIdDetails?.isFinance == null ||
          tractor?.sellingDetailedIdDetails?.isFinance == undefined)
    )?.length;
    //RTO

    this.rtodetailsAvail = this.tractorArray.filter(
      (tractor: any) => tractor?.rtoDetailsId > 0
    )?.length;

    this.rtoDetailsNotAvail = this.tractorArray.filter(
      (tractor: any) =>
        (tractor?.rtoDetailsId == null || tractor?.rtoDetailsId == undefined) &&
        tractor?.sellingDetailedId > 0
    )?.length;

    this.rrtoDetailsNotRequired = this.tractorArray.filter(
      (tractor: any) =>
        tractor?.sellingDetailedId < 0 ||
        tractor?.sellingDetailedId == null ||
        tractor?.sellingDetailedId == undefined
    );
  }

  showData = false;
  generateExcel() {
    // Get the HTML content of the div you want to export
    const element = document.getElementById('work-sheet-report');

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
  renderResult: any;
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
  saveDataTo(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,

      actionByid: this.staffDetails?.id,
      report_type: 'WORK_SHEET',
      extension: extension,
    
      startDate: this.reportDatesRecord?.startDate,
      endDate: this.reportDatesRecord?.endDate,
    };
    console.log('convertBlobToBase64', obj);
    this.share.showLoading('Generating Excel', 20000);
    this.api.postapi('savemastersheet', obj).subscribe((res: any) => {
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
