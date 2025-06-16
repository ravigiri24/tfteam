import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';

import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PDFDocument } from 'pdf-lib';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-purchase-carf',
  templateUrl: './purchase-carf.component.html',
  styleUrls: ['./purchase-carf.component.scss'],
})
export class PurchaseCarfComponent  implements OnInit {

    constructor(
    private alertCtrl: AlertController,
    private share: ShareService,
    private api: ApiService,
    private router: Router,
  private modalControll:ModalController,
    private inAppBrowser: InAppBrowser
  ) {}
beforeServiceImages:any=[]
  ngOnInit() {

this.beforeServiceImages=this.tractor?.rawImages?.filter((f:any)=>f?.imageGroup=='BEFORE_SERVICE') ||[]
if(this.beforeServiceImages?.length>3){
  this.beforeServiceImages.splice(3)
}
this.getList()
  }
  listData:any=[]
  totalAmount=0
    getList() {
    let obj: any = this.share.getListObj('transport_cost', false, [], true);
    obj.tractor_id = this.tractor?.id;
    this.share.showLoading('Loading...');
    this.api.postapi('getTransportDetailsById', obj).subscribe(
      (res: any) => {
        this.listData = res.data;
        this.getListOfOtherExpense()
     
        this.listData.reverse();
        this.totalAmount = 0;
        this.listData?.forEach((f: any) => {
          this.totalAmount =
            Number(this.totalAmount) + Number(f?.expense_amount);
        });
     
    //    this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  dismiss(){
this.modalControll.dismiss()
  }
  jsPDF: any;
  tractor:any

   waitForImagesToLoad(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img');
  const promises: Promise<void>[] = [];

  images.forEach((img) => {
    if (!img.complete) {
      promises.push(
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Prevent hang on error
        })
      );
    }
  });

  return Promise.all(promises).then(() => undefined);
}
 toDataURL(url:any, callback:any) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
     loadImageToPDF(imageUrl:any) {
  fetch(imageUrl, { mode: 'cors' })
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64data:any = reader?.result;

        const doc = new jsPDF();
        doc.addImage(base64data, 'PNG', 10, 10, 180, 160); // (imgData, format, x, y, width, height)
        doc.save("image.pdf");
      };
      reader.readAsDataURL(blob);
    })
    .catch(error => {
      console.error("Error loading image:", error);
    });
}
sanitize(url:any){
  this.api.postapi('sanitizeImage',{path:url}).subscribe((res:any)=>{
    console.log("body",res);
    
  })
}

  generatePDF() {
    //const { jsPDF } = window.jspdf;
    this.share.showLoading('Uploading...', 20000);
  

    const content: any = document.getElementById('purchase_card');

      if(content){

//    this.toDataURL(this.tractor.rawImages[0].imageUrlUrl, function (dataUrl:any) {
// console.log(dataUrl)
//     })
  const doc = new jsPDF('p', 'mm', 'a4');
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
        html2canvas: { useCORS: false}
      })
      .then((f) => {
        this.convertBlobToBase64(pdfBlob);
      });
    setTimeout(() => {}, 0);
  //  })
}
   // }, 500);

    // Convert the content and trigger download
  }
  error:any
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
  jobDetails:any
  saveDataTo() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      pdfObj: this.renderResult,
      tractor_id: this.tractor?.id,
      tfCode: this.tractor?.registractionNo||'',
      actionByid: this.staffDetails?.id,
    };
    console.log('convertBlobToBase64', obj);


    this.api.postapi('savePurchaseCard', obj).subscribe((res: any) => {
      console.log('saveDataTo', res);
      this.share.spinner.dismiss();
      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res?.data?.imageUrlUrl;
        this.openPDF(res?.data?.imageUrlUrl);
      }
    });
  }
  pdfUrl: any;
   listDataOtherExpense: any;
  totalAmountOther = 0;
  getListOfOtherExpense() {
    let obj: any = this.share.getListObj('other_expenses_cost', false, [], true);
    obj.tractor_id = this.tractor?.id;
    
    this.api.postapi('getExtraExpenseDetailsById', obj).subscribe(
      (res: any) => {
        this.listDataOtherExpense = res?.data;
     
       this.share.spinner.dismiss();
        this.listDataOtherExpense.reverse();
        this.totalAmountOther = 0;
        this.listDataOtherExpense?.forEach((f: any) => {
          this.totalAmountOther =
            Number(this.totalAmountOther) + Number(f?.expense_amount);
        });
      
      },
      (error: any) => {
               this.share.spinner.dismiss();
      }
    );
  }
}
