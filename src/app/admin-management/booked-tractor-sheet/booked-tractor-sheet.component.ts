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
@Component({
  selector: 'app-booked-tractor-sheet',
  templateUrl: './booked-tractor-sheet.component.html',
  styleUrls: ['./booked-tractor-sheet.component.scss'],
})
export class BookedTractorSheetComponent  implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
        cssClass: 'modal-xl',
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
this.tractorArray=[]
this.showData=false
  this.genrateReport()
  }
  staffDetails: any;

  selectedItem = 'OPEN';
  genrateReport(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.showData = false;
    let obj = {
      operate: this.staffDetails?.staffCode,
      type: this.selectedItem,
    };
    this.share.showLoading(msg);
    this.api.postapi('get_booking_list', obj).subscribe(
      (res: any) => {
        this.tractorArray = res?.data;
       
     
        //this.tractorArray = this.tractorArray.reverse();
     
        this.showData = true;
      
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
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
      this.selectedDealer = data?.id;

      this.dealerName = data?.name;
      //this.resetOtherValue()
    }

    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  dealerName: any;
  generateExcel() {
    // Get the HTML content of the div you want to export
    const element = document.getElementById('booked-tractor-sheet');

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
        this.selectedDealer = this.dealerList[0]?.id;
        this.dealerName = this.dealerList[0]?.name;
        if (loader) {
          this.share?.spinner?.dismiss();
        }
      },
      (error: any) => {},
    );
  }
}
