import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { jsPDF } from 'jspdf';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-add-offer-letter',
  templateUrl: './add-offer-letter.component.html',
  styleUrls: ['./add-offer-letter.component.scss'],
})
export class AddOfferLetterComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private inAppBrowser: InAppBrowser
  ) { }
  @Output() closeModal = new EventEmitter();
  @Output() updateList = new EventEmitter();

  @Input() editData: any = null;
  @Input() staffList: any = null;
  ngOnInit() {
    console.log('editData', this.editData);

    this.initialize();

    // this.getCityList()
  }
  dismiss() {
    this.modalCtrl.dismiss()
  }
  isOfferLetter = false
  name: any;
  message: any;
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  closeLetter() {
    this.isOfferLetter = false;
  }

  offerLetterForm: FormGroup;
  staffDetails: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);
    this.offerLetterForm = this.fb.group({
      candidateName: new FormControl(this.editData?.candidateName, [Validators.required]),
      dateOfPublish: new FormControl(this.editData?.dateOfPublish, [Validators.required]),
      position: new FormControl(this.editData?.position, [
        Validators.required,
      ]),
      anuual_income: new FormControl(this.editData?.anuual_income, [
        Validators.required,
      ]),
      city: new FormControl(this.editData?.city || "Jabalpur", [
        Validators.required,
      ]),
      state: new FormControl(this.editData?.state || "MP", [
        Validators.required,
      ]),
      anuual_income_word: new FormControl(this.editData?.anuual_income_word, [
        Validators.required,
      ]),
      start_date: new FormControl(this.editData?.start_date, [
        Validators.required,
      ]),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
      probation_period: new FormControl(this.editData?.probation_period || '3 Months',),
      notice_date: new FormControl(this.editData?.notice_date || '30 Days', []),
      id: new FormControl(this.editData?.id || null),

    });
  }



  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  loader = false;
  getListOfStaff() { }
  saveForm() {
    let obj = this.offerLetterForm.value;
    console.log(this.offerLetterForm.value);
    if (this.offerLetterForm.valid) {
      this.isOfferLetter = true
      this.generatedData = this.offerLetterForm.value
      // this.generatePDF();
      //this.generatedData.createdOn=new Date()
    } else {
      this.presentToast('Please Fill All Fields');
    }
  }


  updateForm() {
    if (this.offerLetterForm.valid) {
      let obj: any = this.offerLetterForm.value;
      obj.id = this.editData?.id;
      this.showLoading();
      this.api.postapi('updateCustomerLocationWise', obj).subscribe(
        (res: any) => {
          console.log('$getUpdatedData', res);

          this.spinner?.dismiss();
          this.presentToast(res?.msg);
          this.updateList.emit(res?.data);
          this.closeModal.emit();
        },
        (error: any) => {
          this.spinner?.dismiss();
        }
      );
    } else {
      this.presentToast('Please Fill All Fields');
    }
  }

  spinner: any;
  async showLoading() {
    this.spinner = await this.loadingCtrl.create({
      message: 'Saving...',
      duration: 20000,
    });

    this.spinner.present();
  }
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  jsPDF: any;
  generatePDF() {
    if (this.offerLetterForm.valid) {
      //const { jsPDF } = window.jspdf;
      this.share.showLoading('Uploading...', 20000);
      const doc = new jsPDF('p', 'mm', 'a4');
      const content: any = document.getElementById('contentReport');

      // Convert HTML to PDF
      let pdfBlob: any;
      const pageWidth = doc.internal.pageSize.getWidth();
      const footerHeight = 12;
      const paddingX = 10;
      const footerY = doc.internal.pageSize.getHeight() - footerHeight - 5;

      // Draw yellow rectangle background
      doc.setFillColor(250, 245, 174); // #faf5ae
      doc.rect(paddingX, footerY, pageWidth - 2 * paddingX, footerHeight, 'F');

      // Set font
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Calculate Y for vertical centering
      const textY = footerY + 8; // adjust depending on font size

      // Draw texts
      doc.text('contact@tractorfactory.in', paddingX + 2, textY, { align: 'left' });
      doc.text('07614103373', pageWidth / 2, textY, { align: 'center' });
      doc.text('www.tractorfactory.in', pageWidth - paddingX - 2, textY, { align: 'right' });
      // const footerHeight = 10;
      // const footerY = doc.internal.pageSize.getHeight() - footerHeight - 10; // 10mm margin from bottom
      // const pageWidth = doc.internal.pageSize.getWidth();

      // // Draw yellow background full-width footer
      // doc.setFillColor(250, 245, 174); // light yellow
      // doc.rect(10, footerY, pageWidth - 20, footerHeight, 'F'); // 10mm margin left/right

      // // Set font
      // doc.setFontSize(11);
      // doc.setTextColor(0, 0, 0);

      // // Calculate positions
      // const padding = 12;
      // const textY = footerY + footerHeight / 2 + 2.5; // Vertically center (depends on font size)
      // const centerX = pageWidth / 2;
      // const leftX = 12;
      // const rightX = pageWidth - 12;

      // // Text
      // doc.text('contact@tractorfactory.in', leftX, textY, { align: 'left' });
      // doc.text('07614103373', centerX, textY, { align: 'center' });
      // doc.text('www.tractorfactory.in', rightX, textY, { align: 'right' });

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
          x: 0, // X-position of content
          y: 0, // Y-position of content
          width: 200, // Width of the content to ensure it fits within A4 width (A4 is 210mm)
          windowWidth: 1100, // Optionally set the window width (scale content)
          margin: [5, 5, 0, 5], // Adjust margins (top, left, bottom, right)
          autoPaging: true,
        })
        .then((f) => {
          this.convertBlobToBase64(pdfBlob, 'pdf');
        });
      setTimeout(() => { }, 0);
    } else {
      this.share.presentToast("Please Fill all Fields")
    }
    // Convert the content and trigger download
  }
  private convertBlobToBase64 = (blob: Blob, extension: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);

        this.renderResult = reader.result;
        if (!this.editData) {
          this.saveDataTo(extension);
          console.log('reader.result', reader.result);
        } else {
          this.updateOffer(extension);
        }
      };
      reader.readAsDataURL(blob);
    });
  updateOffer(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj: any = this.offerLetterForm.value
    obj.actionByid = this.staffDetails?.id,
      obj.operate = this.staffDetails?.staffCode,
      obj.extension = extension,
      obj.pdfObj = this.renderResult,
      obj.id = this.editData?.id

    console.log('convertBlobToBase64', obj);

    this.api.postapi('updateOffer', obj).subscribe((res: any) => {
      console.log('saveDataTo', res);
      this.share.spinner.dismiss();
      this.generatedData = res?.data
      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res?.data?.imageUrlUrl;
        this.openPDF(res?.data?.imageUrlUrl);
      }
      this.modalCtrl.dismiss(true)
    });
  }
  renderResult: any;
  generatedData: any
  saveDataTo(extension: any) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj: any = this.offerLetterForm.value
    obj.actionByid = this.staffDetails?.id,
      obj.operate = this.staffDetails?.staffCode,
      obj.extension = extension,
      obj.pdfObj = this.renderResult,

      console.log('convertBlobToBase64', obj);

    this.api.postapi('genrateOffer', obj).subscribe((res: any) => {
      console.log('saveDataTo', res);
      this.share.spinner.dismiss();
      this.generatedData = res?.data
      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res?.data?.imageUrlUrl;
        this.openPDF(res?.data?.imageUrlUrl);
      }
      this.modalCtrl.dismiss(true)
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
