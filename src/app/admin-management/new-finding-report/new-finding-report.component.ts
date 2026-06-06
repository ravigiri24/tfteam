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
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import * as XLSX from 'xlsx';
import { ViewImageComponent } from 'src/app/purchase-management/view-image/view-image.component';
import { jsPDF } from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-new-finding-report',
  templateUrl: './new-finding-report.component.html',
  styleUrls: ['./new-finding-report.component.scss'],
})
export class NewFindingReportComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
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
  async uploadNewFindingImage(dataUpdate: any = null) {
    const modal = await this.modalCtrl.create({
      component: ViewImageComponent,
      componentProps: {
        tractor: dataUpdate,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
    if (data) {
    }
    if (role === 'confirm') {
    }
  }
  srcPage: any;
  ionViewWillEnter() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
    this.tractorArray = [];
    this.showData = false;
    this.newFindingList = [];
    // this.getTractorList();
    this.getDealerList();
  }
  staffDetails: any;
  newFindingList: any = [];
  newFindingListSrc: any = [];
  selectedItem = 'OPEN';
  genrateReport(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.showData = false;
    let obj = {
      operate: this.staffDetails?.staffCode,
      type: this.selectedItem,
      selectedDeal: this.selectedDeal,
      selectedDealer: this.selectedDealer,
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingByDealDealer', obj).subscribe(
      (res: any) => {
        this.tractorArray = res.data;
        this.newFindingListSrc = res?.data;
        this.newFindingList.forEach((tract: any) => {
          tract.name = tract?.modelDetails?.name;
        });
        this.tractorArray = this.tractorArray.reverse();
        if (this.selectedDealer != 'ALL') {
          this.tractorArray = this.newFindingListSrc.filter(
            (f: any) => f.delearDetails?.id == this.selectedDealer,
          );
        } else {
          this.tractorArray = JSON.parse(
            JSON.stringify(this.newFindingListSrc),
          );
        }
        this.showData = true;
        console.log('Tractor', this.tractorArray);
        this.totalProfit = 0;
        this.averageProfit = 0;
        this.total_selling_estimation = 0;
        this.total_costing = 0;
        this.total_costing = 0;
        this.total_finalPrice = 0;
        this.percentInProfit = 0;
        this.tractorArray?.forEach((tractor: any) => {
          tractor.totalAmount = 0;
          tractor?.expenseEstimation?.forEach((cost: any) => {
            tractor.totalAmount =
              Number(tractor.totalAmount) + Number(cost?.cost_value);
          });
          tractor.totalCosting_quoteByDealer =
            Number(tractor?.quoteByDealer) + Number(tractor.totalAmount);
          tractor.totalCosting_quoteByTf =
            Number(tractor?.quoteByTf) + Number(tractor.totalAmount);
          tractor.totalCosting_finalPrice =
            Number(tractor?.finalPrice) + Number(tractor.totalAmount);

          let formattedDate = this.datePipe.transform(
            new Date(tractor?.dealDetails?.deal_date),
            'dd-MM-yyyy',
          );
          tractor.dealName =
            tractor?.dealDetails?.dealerDetails?.name + '-' + formattedDate;

          let finalPrice = tractor?.finalPrice;
          if (Number(finalPrice)>0 && Number(tractor?.selling_estimation) > 0) {
            tractor.profit =
              Number(tractor?.selling_estimation) -
              Number(tractor?.totalCosting_finalPrice);
          } else {
            tractor.profit = 'NA';
          }
          if (tractor.profit != 'NA') {
            this.totalProfit = this.totalProfit + Number(tractor?.profit);
          }
          this.total_selling_estimation =
            this.total_selling_estimation + Number(tractor?.selling_estimation);
          this.total_finalPrice =
            this.total_finalPrice + Number(tractor?.finalPrice);
          this.total_costing =
            this.total_costing + Number(tractor?.totalCosting_finalPrice);
        });
        if (this.totalProfit && this.tractorArray?.length) {
          this.averageProfit = this.totalProfit / this.tractorArray?.length;
        }
        this.percentInProfit = Number(
          ((this.totalProfit / this.total_selling_estimation) * 100).toFixed(2),
        );
        this.calculationIn=this.tractorArray?.filter((tractor:any)=>Number(tractor?.finalPrice)>0 && Number(tractor?.selling_estimation) > 0)?.length
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
  percentInProfit = 0;
  totalProfit: any = 0;
  averageProfit: any = 0;
  calculationIn: any = 0;
  total_selling_estimation: any = 0;
  total_costing: any = 0;
  total_finalPrice: any = 0;
  // listData: any;
  // totalAmount = 0;
  // getListEstimation(tractor: any) {
  //   let obj: any = this.share.getListObj(
  //     'tractor_cost_estimation',
  //     false,
  //     [],
  //     true,
  //   );
  //   obj.tractor_id = tractor?.id;
  //   this.share.showLoading('Loading...');
  //   this.api.postapi('tractor_cost_estimation_byId', obj).subscribe(
  //     (res: any) => {
  //       let listData = res.data;
  //       // this.listData = res.data;

  //       listData.reverse();
  //       tractor.totalAmount = 0;
  //       listData?.forEach((f: any) => {
  //         tractor.totalAmount =
  //           Number(tractor.totalAmount) + Number(f?.cost_value);
  //       });
  //       this.share.spinner.dismiss();
  //     },
  //     (error: any) => {},
  //   );
  // }
  async openCrudManagement(type: any) {
    const modal = await this.modalCtrl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    this.getDealerList(true);
    console.log('role', role);
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
        showAddButton: false,
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
      //   this.newFindingForms.controls['dealerId'].setValue(data?.id);
      if (table_name == 'dealer_list') {
        this.selectedDealer = data?.id;

        this.dealerName = data?.name;
        this.getDealList(true);
      } else if (table_name == 'new_finding_deals') {
        this.selectedDeal = data?.id;

        this.dealName = data?.name;
      }

      //this.resetOtherValue()
    }

    (console.log('role', role, data),
      this.selectedDeal,
      'dd',
      this.selectedDealer);

    if (role === 'confirm') {
    }
  }
  dealerName: any;
  generateExcel() {
    // Get the HTML content of the div you want to export
    const element = document.getElementById('new-finding-sheet-report');

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
  backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
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
  renderResult: any;
  saveDataTo(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,

      actionByid: this.staffDetails?.id,
      report_type: 'NEW_FINDING_SHEET',
      extension: extension,
      reparing_center: this.staffDetails?.repair_center,
      startDate: null,
      endDate: null,
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
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    // this.error = dataUrl;
    browser.show();
  }
  pdfUrl: any;
  showData: any = false;
  ngOnInit() {}
  dealerList: any = [];
  tractorArray: any = [];
  selectedDealer: any;
  getDealerList(loader: any = false) {
    this.dealerList = [];
    let obj = this.share.getListObj('dealer_list', false, [], false);
    if (loader) {
      this.share.showLoading('Loading...');
    }
    // this.share.showLoading('Loading...')
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.dealerList = res.data;
        this.dealerList.unshift({ id: 'ALL', name: 'All' });
        this.selectedDealer = this.dealerList[1]?.id;
        this.dealerName = this.dealerList[1]?.name;
        this.getDealList();
        if (loader) {
          this.share?.spinner?.dismiss();
        }
      },
      (error: any) => {},
    );
  }
  dealList: any = [];
  getDealList(loader: any = false) {
    this.dealList = [];
    let obj: any = this.share.getListObj('dealer_list', false, [], false);
    if (loader) {
      this.share.showLoading('Loading...');
    }
    obj.dealerId = this.selectedDealer;
    // this.share.showLoading('Loading...')
    this.api.postapi('getDealListById', obj).subscribe(
      (res: any) => {
        this.dealList = res.data;
        this.dealList?.forEach((f: any) => {
          let formattedDate = this.datePipe.transform(
            new Date(f?.deal_date),
            'dd-MM-yyyy',
          );
          f.name = f.dealerName + '-' + formattedDate;
        });
        if (this.dealList?.length) {
          this.dealList.unshift({ id: 'ALL', name: 'All' });
          this.selectedDeal = this.dealList[1]?.id;
          this.dealName = this.dealList[1]?.name;
        } else {
          this.selectedDeal = null;
          this.dealName = null;
        }

        if (loader) {
          this.share?.spinner?.dismiss();
        }
      },
      (error: any) => {},
    );
  }
  dealName: any;
  selectedDeal: any;
}
