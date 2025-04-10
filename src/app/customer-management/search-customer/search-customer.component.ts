import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import * as XLSX from 'xlsx';
import { ReviewPageComponent } from '../review-page/review-page.component';
import { AddCustomerPopUpComponent } from '../add-customer-pop-up/add-customer-pop-up.component';
import { ViewCustomerDataComponent } from '../view-customer-data/view-customer-data.component';

import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss'],
})
export class SearchCustomerComponent implements OnInit {
  tractor_id: any;
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser
  ) {}
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  ngOnInit() {
    this.getStateList();
  }
  salva() {
    const worksheet = XLSX.utils.table_to_sheet(
      document.getElementById('table')
    );
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'calib');
    XLSX.writeFile(workbook, 'calib' + this.EXCEL_EXTENSION);
    console.log(worksheet);
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  search = {
    name: null,
  };
  onInputFocus() {}
  focusOut() {}
  searchBy: any = 'NUMBER';
  searchCustomer() {
    if(this.searchBy=='NUMBER'){
      this.serachByNumber()
    }
  else  if(this.searchBy=='NAME'){
      this.getCustomerByName()
    }
    else if(this.searchBy=='STATE'){
      this.getStateWiseList()
    }
    else if(this.searchBy=='CITY'){
      this.getCityWiseList()
    }
  }
  stateList: any = [];
  getStateList() {
    this.share.showLoading('Loading');
    let obj = this.share.getListObj('state_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.stateList = res?.data;
        this.getCityList();
      },
      (error: any) => {}
    );
  }
  cityList: any = [];
  getCityList() {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;

        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  stateName: any;
  cityName: any;
  state_id: any;
  city_id: any;
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (itemName == 'City' && this.state_id) {
      return true;
    } else {
      return false;
    }
  }
  async selectItem(list: any, itemName: any, table_name: any) {
    let openStatus = this.checkOpenCon(itemName);
    if (openStatus) {
      let otherObjects: any;
      if (itemName == 'City') {
        otherObjects = {
          state_id: this.state_id,
        };
      }

      const modal = await this.modalControl.create({
        component: SelectWithSearchComponent,
        componentProps: {
          list: list,
          itemName: itemName,
          table_name: table_name,
          otherObjects: otherObjects,
        },
      });
      await modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (itemName == 'State') {
        if (data) {
          this.customerList=[]
          this.state_id = data?.id;
          this.city_id = null;
          this.cityName = null;
          this.stateName = data?.name;
          this.getCityListFilter();
        }
      } else if (itemName == 'City') {
        this.customerList=[]
        this.cityName = data?.name;
        this.city_id = data?.id;
      }
      console.log('role', role, data);

      if (role === 'confirm') {
      }
    } else {
      this.share.presentToast('Please Select State First');
    }
  }
  cityListFilter: any = [];
  getCityListFilter() {
    let getStateId = this.state_id;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
  customerData: any = [];
  isCustomersFound = false;
  staffDetails:any
  serachByNumber() {
    this.share.showLoading("Searching")
    this.customerData = [];
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
     
      mobileNo:this.search.name
    };

    this.api.postapi('getCustomerByMobileNumber', obj).subscribe(
      (res: any) => {
        if (res?.status == 1) {
          this.isCustomersFound = true;
          this.customerData = [res?.data];
         
        } else {
          
          this.isCustomersFound = false;
          this.share.presentToast("Not found any customer")
          this.customerData = [];
        }

        this.share.spinner.dismiss();
      },
      (error: any) => {
        this.isCustomersFound = false;
        this.share.spinner.dismiss();
      }
    );
  }
  getCustomerByName(){
    this.share.showLoading("Searching")
    this.customerData = [];
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
     
      name:this.search.name
    };

    this.api.postapi('getCustomerByName', obj).subscribe(
      (res: any) => {
        if (res?.status == 1) {
          this.isCustomersFound = true;
          this.customerData = res?.data;
         
        } else {
          
          this.isCustomersFound = false;
          this.share.presentToast("Not found any customer")
          this.customerData = [];
        }

        this.share.spinner.dismiss();
      },
      (error: any) => {
        this.isCustomersFound = false;
        this.share.spinner.dismiss();
      }
    );
  }
   async addRemark(customer:any=null){
  
          const modal = await this.modalControl.create({
            component: ReviewPageComponent,
            componentProps: {
              customer: customer,
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          console.log('role', role);
        
    }
   async viewCustomer(customer:any=null){
      const modal = await this.modalControl.create({
        component: ViewCustomerDataComponent,
        componentProps: {
          customerSelected: customer,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
    }
    editData:any=[]
    editIndex:any
    async addCustomer(editData:any=null,editIndex:any=null){
      this.editIndex = editIndex;
      this.editData=editData
          const modal = await this.modalControl.create({
            component: AddCustomerPopUpComponent,
            componentProps: {
             editData: editData,
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          console.log('role', role);
          if(data){
          this.updateList(data)
          }
           
    }
    updateList(e: any) {
      if (this.editData) {
        e.followUpDate=this.editData?.followUpDate
        e.leadsChat=this.editData?.leadsChat
        this.customerData[this.editIndex] = e;
      } else {
      //  this.customerData.unshift(e);
      }
    }
    customerList:any=[]
   
   
      generateExcel() {
        // Get the HTML content of the div you want to export
        const element = document.getElementById('customerDataReport');
    
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
      jsPDF: any;
      generatePDF() {
        //const { jsPDF } = window.jspdf;
        this.share.showLoading('Uploading...', 20000);
        const doc = new jsPDF('p', 'mm', 'a4');
    
        const content: any = document.getElementById('customerDataReport');
    
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
    
      renderResult: any;
      printData: any;
      saveDataTo(extension: any) {
        let name=null
        if(this.searchBy=='STATE'){
name=this.stateName
        }else if(this.searchBy=='CITY'){
          name=this.cityName
        }
        let staffDetails: any = this.share.get_staff();
        this.staffDetails = JSON.parse(staffDetails);
    
        let obj = {
          operate: this.staffDetails?.staffCode,
          pdfObj: this.renderResult,
    
          actionByid: this.staffDetails?.id,
          report_type:this.searchBy,
          extension: extension,
          name:name
        
        };
        console.log('convertBlobToBase64', obj);
    
        this.api.postapi('customer_record_generation', obj).subscribe((res: any) => {
          console.log('saveDataTo', res);
          this.share.spinner.dismiss();
          if (res?.data?.imageUrlUrl) {
            this.pdfUrl = res?.data?.imageUrlUrl;
            this.openPDF(res?.data?.imageUrlUrl);
          }
        });
      }
      pdfUrl:any
      error: any;
  openPDF(dataUrl: string) {
    const browser = this.inAppBrowser.create(dataUrl, '_blank');
    this.error = dataUrl;
    browser.show();
  }
    resetData(){
      this.customerList=[]
      this.state_id=null;
      this.city_id=null;
      this.stateName=null;
      this.cityName=null;
      
    }
    recordStatename:any=[]
    getStateWiseList(){
      if(this.state_id){
        this.recordStatename=this.stateName
      this.share.showLoading("Searching")
      this.customerList = [];
      let staffDetails: any = this.share.get_staff();
      this.staffDetails = JSON.parse(staffDetails);
  
      let obj = {
        operate: this.staffDetails?.staffCode,
       
        state_id:this.state_id
      };
  
      this.api.postapi('getCustomerByState', obj).subscribe(
        (res: any) => {
          if (res?.status == 1) {
            this.isCustomersFound = true;
            this.customerList = res?.data;
           
          } else {
            
            this.isCustomersFound = false;
            this.share.presentToast("Not found any customer")
            this.customerData = [];
          }
  
          this.share.spinner.dismiss();
        },
        (error: any) => {
          this.isCustomersFound = false;
          this.share.spinner.dismiss();
        }
      );
    }else{
      this.share.presentToast("Please select state")
    }
    }
    recordCityname:any
    getCityWiseList(){
      if(this.city_id){
        this.recordCityname=this.cityName
        this.recordStatename=this.stateName
      this.share.showLoading("Searching")
      this.customerList = [];
      let staffDetails: any = this.share.get_staff();
      this.staffDetails = JSON.parse(staffDetails);
  
      let obj = {
        operate: this.staffDetails?.staffCode,
       
        city_id:this.city_id
      };
  
      this.api.postapi('getCustomerByCity', obj).subscribe(
        (res: any) => {
          if (res?.status == 1) {
            this.isCustomersFound = true;
            this.customerList = res?.data;
           
          } else {
            
            this.isCustomersFound = false;
            this.share.presentToast("Not found any customer")
            this.customerData = [];
          }
  
          this.share.spinner.dismiss();
        },
        (error: any) => {
          this.isCustomersFound = false;
          this.share.spinner.dismiss();
        }
      );
    }else{
      this.share.presentToast("Please select city")
    }
    }
}
