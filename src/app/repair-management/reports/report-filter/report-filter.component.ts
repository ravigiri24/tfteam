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
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
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
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser
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
  reportType: any = 'Job List';
  ngOnInit() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.getMaterialList();
    this.initialize();
  }
  materialList: any = [];
  getMaterialList(loader: any = false) {
    this.share.showLoading('Getting Data...');
    let obj: any = this.share.getListObj('repairmateriallist', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.materialList = res?.data || [];
        this.getCategoryList();
      },
      (error: any) => {}
    );
  }
  categoryList: any = [];
  expenseHeader: any = [];
  catTotal: any = {};
  getCategoryList(loader: any = false) {
    this.expenseHeader = [];
    this.expenseHeader.push('Service');
    let obj: any = this.share.getListObj('spare_category', false, [], true);
    this.catTotal.Service=0
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.categoryList = res?.data || [];

        this.categoryList?.forEach((cat: any) => {
          this.catTotal[cat?.name] = 0;
          this.expenseHeader.push(cat?.name);
        });
        console.log('this.expenseHeader', this.expenseHeader, this.catTotal);

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      jobType: new FormControl('Start', [Validators.required]),
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
  jobList: any = [];
  allDetails: any;
  reportDatesRecord: any;
  genrateReport() {
    if (this.form.valid) {
      if (
        this.form.controls['startDate']?.value <=
        this.form.controls['endDate']?.value
      ) {
        let obj: any = this.share.getListObj(
          'getJobListByDate',
          false,
          [],
          true
        );

        obj.startDate = this.form.controls['startDate'].value;
        obj.endDate = this.form.controls['endDate'].value;
        obj.jobType = this.form.controls['jobType'].value;

        this.share.showLoading('Fetching Report...');
        this.reportDatesRecord = obj;
        this.api.postapi('getJobListByDate', obj).subscribe(
          (res: any) => {
            this.allDetails = res?.data;
            this.createReport();
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

  reportDetails: any;

  createReport() {
    this.jobList = [];
    this.allDetails?.jobList?.forEach((job: any) => {
      let obj: any = {
        tfCode: job?.tfCode,
        modelName:job?.modelDetails?.name,
        Service: 0,
      };
      this.categoryList?.forEach((cat: any) => {
        if (!obj[cat?.name]) {
          obj[cat?.name] = 0;
        }
      });
      this.getExpenseCost(job?.job_expenses, obj);
      this.jobList.push(obj);
    });
    console.log('jobList', this.jobList);
  }
  getExpenseCost(expenses: any = [], obj: any) {
    let getServiceList = expenses?.filter(
      (ex: any) => ex?.expense_method == 'SERVICE'
    );
    Object.keys(this.catTotal)?.forEach((cat:any)=>{
      this.catTotal[cat]=0
    })
    let serviceCost: any = 0;
    getServiceList?.forEach((ser: any) => {
      serviceCost = Number(serviceCost) + Number(ser?.total_expense);
    });
    obj.Service = serviceCost;
    this.catTotal.Service=serviceCost
    let getMaterialList = expenses?.filter(
      (ex: any) => ex?.expense_method == 'MATERIAL'
    );
    getMaterialList?.forEach((material: any) => {
      let getMateraiDetail = this.materialList?.find(
        (mat: any) => mat.id == material?.expense_id
      );
      let getCategory = this.categoryList?.find(
        (cat: any) => cat?.id == getMateraiDetail?.category
      );
      //  if (obj[getCategory?.name]) {
      obj[getCategory?.name] =
        Number(obj[getCategory?.name]) + Number(material?.total_expense);
      this.catTotal[getCategory?.name] =
        this.catTotal[getCategory?.name] + Number(material?.total_expense);
      // }
    });
    console.log("  this.catTotal",  this.catTotal);
    
  }
  jsPDF: any;
  generatePDF() {
    //const { jsPDF } = window.jspdf;
    this.share.showLoading('Uploading...', 20000);
    const doc = new jsPDF('p', 'mm', 'a4');

    const content: any = document.getElementById('contentReport');

    // Convert HTML to PDF
    let pdfBlob: any;
    doc
      .html(content, {
        callback: function (doc: any) {
          // Save the generated PDF
          //      doc.save('invoice.pdf');
          // const img:any = document.getElementById('imageLogo');

          //img.onload = function () {
          //doc.addImage(img, 'JPEG', 20, 40, 180, 160);
          pdfBlob = doc.output('blob');
          console.log('pdfBlob', pdfBlob);
          //  }
        },
        x: 10, // X-position of content
        y: 10, // Y-position of content
        width: 180, // Width of the content to ensure it fits within A4 width (A4 is 210mm)
        windowWidth: 800, // Optionally set the window width (scale content)
        margin: [10, 10, 10, 10], // Adjust margins (top, left, bottom, right)
        autoPaging: true,
      })
      .then((f) => {
        this.convertBlobToBase64(pdfBlob, 'pdf');
      });
    setTimeout(() => {}, 0);

    // Convert the content and trigger download
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
  staffDetails: any;
  renderResult: any;
  printData: any;
  saveDataTo(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,

      actionByid: this.staffDetails?.id,
      report_type: this.reportType,
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
  error: any;
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    this.error = dataUrl;
    browser.show();
  }
}
