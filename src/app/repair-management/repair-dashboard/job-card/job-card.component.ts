import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PDFDocument } from 'pdf-lib';
import { ShareService } from 'src/app/share.service';
//import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { jsPDF } from 'jspdf';
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
@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
})
export class JobCardComponent implements OnInit {
  @Input() jobDetails: any;
  @Input() expenseServiceList: any = [];
  @Input() expenseMaterialList: any = [];
  @Input() materialList: any = [];
  @Input() spareList: any = [];
  @Input() categroyWiseMaterial: any = [];
  @Input() expenseServiceCost: any = 0;
  @Input() isJobDone: any = false;

  @Input() expenseMaterialCost: any = 0;
  constructor(
    private alertCtrl: AlertController,
    private share: ShareService,
    private api: ApiService,
    private router: Router,

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

  fileOpen: any;
  fileOpenErro: any;

  error: any;

  ngOnInit() {
    console.log(
      'materialList',
      this.materialList,
      this.spareList,
      this.expenseMaterialList,"categroyWiseMaterial",this.categroyWiseMaterial
    );
  }

  async actionJob(msg: any, status: any) {
    const alert = await this.alertCtrl.create({
      header: msg,
      subHeader: '',
      message: 'Are You Sure',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Yes',
          role: 'Yes',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result?.role == 'Yes') {
      this.completeJob(status);
    }
  }

  completeJob(status: any) {
    let obj = {
      src: 'repairing_record',
      data: { isCompleted: status },
      id: this.jobDetails?.id,
    };

    this.share.showLoading('Closing Job...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();

      this.share.presentToast('Closed Successfully...');
      this.router.navigate(['/repair-management/job-list']);
    });
  }
  jsPDF: any;
  generatePDF() {
    //const { jsPDF } = window.jspdf;
    this.share.showLoading('Uploading...', 10000);
    const doc = new jsPDF('p', 'mm', 'a4');

    const content: any = document.getElementById('content');

    // Convert HTML to PDF
    let pdfBlob: any;
    doc
      .html(content, {
        callback: function (doc: any) {
          // Save the generated PDF
          //      doc.save('invoice.pdf');
          pdfBlob = doc.output('blob');
          console.log('pdfBlob', pdfBlob);
        },
        x: 10, // X-position of content
        y: 10, // Y-position of content
        width: 180, // Width of the content to ensure it fits within A4 width (A4 is 210mm)
        windowWidth: 800, // Optionally set the window width (scale content)
        margin: [10, 10, 10, 10], // Adjust margins (top, left, bottom, right)
        autoPaging: true,
      })
      .then((f) => {
        this.convertBlobToBase64(pdfBlob);
      });
    setTimeout(() => {}, 0);

    // Convert the content and trigger download
  }

  async generateAndSharePdf() {
    const docDefinition: any = {
      content: [
        { text: 'S.S. TRACTOR FACTORY PVT LTD', style: 'header' },
        { text: 'Invoice No: INV-0001', style: 'subheader' },
        { text: 'Date: 17-Feb-2025', style: 'subheader' },
        { text: 'Registration No: 123456', style: 'subheader' },
        // Add more content based on your table structure here
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        content: {
          fontSize: 12,
        },
      },
    };
    //const content:any = document.getElementById('content');

    // Convert HTML to PDF

    // Get the Blob of the generated PDF
    pdfMake.createPdf(docDefinition).getBlob(async (blob) => {
      try {
        this.convertBlobToBase64(blob);

        const blobUrl = URL.createObjectURL(blob);
        // Log the Blob URL (you can use this URL for downloading, previewing, etc.)
        console.log('Blob URL:', blobUrl);
        console.log('PDF shared successfully!');
      } catch (error) {
        console.error('Error saving or sharing the PDF:', error);
      }
    });
  }
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    this.error = dataUrl;
    browser.show();
  }
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);

        this.renderResult = reader.result;
        this.saveDataTo();
        console.log('reader.result', reader.result);
      };
      reader.readAsDataURL(blob);
    });
  staffDetails: any;
  renderResult: any;
  saveDataTo() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,
      tractor_id: this.jobDetails?.id,
      billNumber: this.jobDetails?.billNumber||'',
      actionByid: this.staffDetails?.id,
    };
    console.log('convertBlobToBase64', obj);


    this.api.postapi('saveJobPdf', obj).subscribe((res: any) => {
      console.log('saveDataTo', res);
      this.share.spinner.dismiss();
      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res?.data?.imageUrlUrl;
        this.openPDF(res?.data?.imageUrlUrl);
      }
    });
  }
  pdfUrl: any;
}
