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
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-master-sheet-advance',
  templateUrl: './master-sheet-advance.component.html',
  styleUrls: ['./master-sheet-advance.component.scss'],
})
export class MasterSheetAdvanceComponent implements OnInit {
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService:CommonMethodService
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
  selectedItem: any = 'YEARLY';
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
    });
    console.log('this.dateForm', this.form.value);
  }
  openDetails(tractor:any){
this.commonService.tractorSummaryDetails(tractor)
  }
  yearArray:any=[]
makePeroidArray() {
  const calculationYear = this.share.calculationYear;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Current Financial Year (Apr-Mar)
  const currentFinancialYear =
    currentDate.getMonth() >= 3
      ? currentDate.getFullYear()
      : currentDate.getFullYear() - 1;

  // ===========================
  // Year Array
  // ===========================
  this.yearArray = Array.from(
    { length: currentYear - calculationYear + 1 },
    (_, i) => {
      const year = calculationYear + i;

      return {
        id: year,
        name: `Year ${year}-${year + 1}`,
        startDate: `${year}-04-01`,
        endDate: `${year + 1}-03-31`
      };
    }
  ).reverse();

  this.yearArray.forEach((f: any) => {
    const year = f.id;
    const isCurrentFY = year === currentFinancialYear;

    // ===========================
    // Quarter Array
    // ===========================
    let quarterArray = [
      {
        id: `${year}-Q1`,
        yearId: year,
        quarterNo: 1,
        name: `Q1 (Apr ${String(year).slice(-2)}-Jun ${String(year).slice(-2)})`,
        startDate: `${year}-04-01`,
        endDate: `${year}-06-30`
      },
      {
        id: `${year}-Q2`,
        yearId: year,
        quarterNo: 2,
        name: `Q2 (Jul ${String(year).slice(-2)}-Sep ${String(year).slice(-2)})`,
        startDate: `${year}-07-01`,
        endDate: `${year}-09-30`
      },
      {
        id: `${year}-Q3`,
        yearId: year,
        quarterNo: 3,
        name: `Q3 (Oct ${String(year).slice(-2)}-Dec ${String(year).slice(-2)})`,
        startDate: `${year}-10-01`,
        endDate: `${year}-12-31`
      },
      {
        id: `${year}-Q4`,
        yearId: year,
        quarterNo: 4,
        name: `Q4 (Jan ${String(year + 1).slice(-2)}-Mar ${String(year + 1).slice(-2)})`,
        startDate: `${year + 1}-01-01`,
        endDate: `${year + 1}-03-31`
      }
    ];

    // Only current & past quarters for current FY
    if (isCurrentFY) {
      quarterArray = quarterArray.filter(q => new Date(q.startDate) <= currentDate);
    }

    f.quarter = quarterArray;

    // ===========================
    // Month Array
    // ===========================
    let monthArray: any[] = [];

    const months = [
      { name: 'April', month: 3 },
      { name: 'May', month: 4 },
      { name: 'June', month: 5 },
      { name: 'July', month: 6 },
      { name: 'August', month: 7 },
      { name: 'September', month: 8 },
      { name: 'October', month: 9 },
      { name: 'November', month: 10 },
      { name: 'December', month: 11 },
      { name: 'January', month: 0 },
      { name: 'February', month: 1 },
      { name: 'March', month: 2 }
    ];

    months.forEach((m) => {
      const actualYear = m.month >= 3 ? year : year + 1;

      const monthNumber = String(m.month + 1).padStart(2, '0');
      const lastDay = new Date(actualYear, m.month + 1, 0).getDate();

      const monthData = {
        id: `${actualYear}${monthNumber}`, // e.g. 202504
        yearId: year,
        monthNo: m.month + 1,
        name: `${m.name} ${String(actualYear).slice(-2)}`,
        startDate: `${actualYear}-${monthNumber}-01`,
        endDate: `${actualYear}-${monthNumber}-${String(lastDay).padStart(2, '0')}`
      };

      // For current FY show only current/past months
      if (!isCurrentFY || new Date(monthData.startDate) <= currentDate) {
        monthArray.push(monthData);
      }
    });

    f.monthArray = monthArray;
  });

  console.log(this.yearArray);

  this.selectedYear = this.yearArray[0];
  this.selectedItem = 'YEARLY';
}
  selectedMonth:any
  selectQuarter:any
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

      if(itemName=='Year'){
        this.selectedYear=data
        this.selectQuarter=null;
        this.selectedMonth=null;
        console.log("this.selectedYear",this.selectedYear);
        
      }
        if(itemName=='Quarter'){
  
        this.selectQuarter=data;
        
        this.selectedMonth=null;
             console.log("this.selectQuarter",this.selectQuarter);
      }
        if(itemName=='Month'){
  
        this.selectQuarter=null;
        this.selectedMonth=data;
          console.log("this.selectedMonth",this.selectedMonth);
      }
      if(itemName=='Store'){
     this.selectedStore=data?.id
     this.storeName=data?.name
     this.getDataOfStore()
      }
  
        //this.resetOtherValue()
      }
  
  
      if (role === 'confirm') {
      }
    }
  getFilterElemnets(item: any) {
    if (item === 'YEARLY') {
      return { title: 'Year', selectedItem: null, };
    } else if (item === 'QUARTERLY') {
      return { title: 'Quarterly', selectedItem: null };
    } else if (item === 'MONTHLY') {
      return { title: 'Monthly', selectedItem: null };
    } else if (item === 'DATE') {
      return { title: 'Date', selectedItem: null };
    }

    return { title: '', selectedItem: null }; // Default return
  }
  selectedYear:any
  selectedFilter: any = {};
  selectFilter(item: any) {
    this.selectedItem = item;
    // let element = this.getFilterElemnets(item);

    console.log("this.selectedFilter",this.selectedFilter);
    
  }
  form: FormGroup;
  dismiss() {
    return this.modalCtrl.dismiss(null);
  }
  // generateExcel() {
   
  //   const element = document.getElementById('master-sheet-report');


  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

 
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


  //   const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

   
  //   const blob: Blob = new Blob([wbout], { type: 'application/octet-stream' });

  
  //   this.convertBlobToBase64(blob, 'xlsx');
   
  // }


//   generateExcel() {
//   const element = document.getElementById('master-sheet-report');

//   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
//   const wb: XLSX.WorkBook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//   const wbout = XLSX.write(wb, {
//     bookType: 'xlsx',
//     type: 'array'
//   });

//   const blob = new Blob(
//     [wbout],
//     {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     }
//   );

//   const file = new File(
//     [blob],
//     'MasterSheet.xlsx',
//     {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     }
//   );

//   this.uploadExcel(file);
// }

generateExcel() {

  const div = document.getElementById('master-sheet-report');
  const table = div?.querySelector('table') as HTMLTableElement;

  if (!table) {
    this.share.presentToast('Table not found');
    return;
  }

  //this.share.presentToast('Rows: ' + table.rows.length);

  try {

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    //this.share.presentToast('Array: ' + wbout.byteLength + ' bytes');

    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

   // this.share.presentToast('Blob: ' + blob.size + ' bytes');

    this.uploadExcel(blob);

  } catch (e: any) {
    console.log(e);
    this.share.presentToast('Excel Error : ' + e);
  }

}
uploadExcel(blob: Blob) {

  let staffDetails: any = this.share.get_staff();
  this.staffDetails = JSON.parse(staffDetails);

  //this.share.presentToast('Upload Blob: ' + blob.size + ' bytes');

  const formData = new FormData();

  formData.append('operate', this.staffDetails?.staffCode);
  formData.append('actionByid', this.staffDetails?.id);
  formData.append('report_type', 'MASTER_SHEET');
  formData.append('extension', 'xlsx');
  formData.append('reparing_center', this.staffDetails?.repair_center);
  formData.append('startDate', this.reportDatesRecord?.startDate);
  formData.append('endDate', this.reportDatesRecord?.endDate);

  // Blob upload
  formData.append(
    'file',
    blob,
    'MasterSheet.xlsx'
  );

  this.share.showLoading('Uploading Excel', 20000);

  this.api.postapi('savemastersheetAdvance', formData).subscribe(

    (res: any) => {

      this.share.spinner.dismiss();

      this.share.presentToast('Upload Success');

      console.log(res);

      if (res?.data?.imageUrlUrl) {
        this.pdfUrl = res.data.imageUrlUrl;
        this.openPDF(this.pdfUrl);
      }

    },

    (err: any) => {

      this.share.spinner.dismiss();

      console.log(err);

      this.share.presentToast('Upload Failed');

    }

  );

}
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
    this.getLogisticExpense();
    this.getWareHouseList()
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
    this.initialize();
    this.makePeroidArray()
    //this.selectFilter(this.selectedFilter)

  }
  selectedStore:any
  storeName:any
    warehouseList: any = [];
  getWareHouseList(loader: any = false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.warehouseList = this.warehouseList.reverse();
          this.share.putAllInWareHouse(this.warehouseList)
          console.log('this.warehouseList', this.warehouseList);
          //if (!loader) {
            this.selectedStore = this.warehouseList[0]?.id;
            this.storeName=this.warehouseList[0]?.name
          //}
        },
        (error: any) => { }
      );
    }, 0);
  }
  allDetails: any;
  tractorArray: any;
  showData = false;
  selectedPeriod:any
  genrateReport() {
this.resetValue()
    this.showData = false;
    let startDate:any
    let endDate:any
    if(this.selectedItem=='YEARLY'){
          this.selectedPeriod=this.selectedYear
   startDate=this.selectedYear?.startDate;
   endDate=this.selectedYear?.endDate
    }   else if(this.selectedItem=='QUARTERLY'){
          this.selectedPeriod=this.selectQuarter
   startDate=this.selectQuarter?.startDate;
   endDate=this.selectQuarter?.endDate
    }
     else if(this.selectedItem=='MONTHLY'){
          this.selectedPeriod=this.selectedMonth
   startDate=this.selectedMonth?.startDate;
   endDate=this.selectedMonth?.endDate
    }
    else if(this.selectedItem=='DATE'){
 startDate=this.form.value.startDate
 endDate=this.form.value.endDate
 this.selectedPeriod={startDate:this.form.value.startDate,endDate:this.form.value.endDate}
    }
  
      if (
        startDate <=
        endDate
      ) {
        let obj: any = this.share.getListObj(
          'getTractorSheetByDateAdvance',
          false,
          [],
          true,
        );

        obj.startDate =startDate;
        obj.endDate = endDate;
          this.selectedStore = this.warehouseList[0]?.id;
            this.storeName=this.warehouseList[0]?.name
   //this.selectedPeriod.startDate='2025-04-01'
        this.share.showLoading('Fetching Report...',20000);
        this.reportDatesRecord = obj;
        this.api.postapi('getTractorSheetByDateAdvance', obj).subscribe(
          (res: any) => {
                this.share.presentToast("Data Fetched please Wait")
            this.allDetails = res?.data;
            this.allDetails.spareList = this.allDetails.spareList.reverse();
            this.tractorArray = res?.data?.tractorList;
            this.tractorArray?.forEach((f: any) => {
              if (f?.registractionNo) {
                const number = parseInt(f?.registractionNo?.split('-')[1], 10);
                f.tfCode = number;
              } else {
                f.tfCode = 100000;
              }
            });
            this.tractorArray?.sort((a: any, b: any) => a?.tfCode - b?.tfCode);
            //this.tractorArray = this.tractorArray.reverse();
            this.tractorArray?.forEach((tractor: any) => {
              let logisticExpense: any = {};
              let totalAmountBreakup = 0;

              // this.logisticExpenseTypeList?.forEach((log: any) => {
              //   let haveExpense = tractor?.transportCosting?.find(
              //     (f: any) => f.expense_id == log?.id
              //   );

              //   if (haveExpense) {
              //     totalAmountBreakup =
              //       Number(totalAmountBreakup) + Number(haveExpense?.expense_amount);
              //     logisticExpense[log?.name] = haveExpense?.expense_amount;
              //   } else {
              //     logisticExpense[log?.name] = 0;
              //   }

              // });

              tractor?.transportCosting?.forEach((log: any) => {
                let haveExpense = this.logisticExpenseTypeList?.find(
                  (f: any) => f.id == log?.expense_id,
                );

                if (haveExpense) {
                  totalAmountBreakup =
                    Number(totalAmountBreakup) + Number(log?.expense_amount);
                  if (logisticExpense[haveExpense?.name] > 0) {
                    logisticExpense[haveExpense?.name] =
                      Number(logisticExpense[haveExpense?.name]) +
                      Number(log?.expense_amount);
                  } else {
                    logisticExpense[haveExpense?.name] = log?.expense_amount;
                  }
                } else {
                  logisticExpense[haveExpense?.name] = 0;
                }
              });

              tractor.logisticExpense = logisticExpense;
              console.log('logisticExpense', logisticExpense);
              if (tractor?.purchasedetail?.purchasePrice > 0) {
                totalAmountBreakup =
                  Number(totalAmountBreakup) +
                  Number(tractor?.purchasedetail?.purchasePrice);
              }
              // if(tractor?.rtoDetails){
              if (tractor?.rto_cost > 0) {
                totalAmountBreakup =
                  Number(totalAmountBreakup) + Number(tractor?.rto_cost);
              }
              if (tractor?.insurance_cost > 0) {
                totalAmountBreakup =
                  Number(totalAmountBreakup) + Number(tractor?.insurance_cost);
              }
              //}
              tractor.totalAmountBreakup = totalAmountBreakup;
              //need to call at last for all calculation
              this.calculateRepairCost(tractor);
            });
            // this.createReport();
            console.log('tractorArray', this.tractorArray);

            this.share.spinner.dismiss();
        
            setTimeout(() => {
              this.showData = true;
            }, 0);
         // caluclation regarding advance 
            let purchasedTractor= this.tractorArray.filter((f: any) =>
  new Date(f.reachDate) >= new Date(this.selectedPeriod.startDate) &&
  new Date(f.reachDate) <= new Date(this.selectedPeriod.endDate)
);
 
      

      this.totalPurchaseNo=  purchasedTractor?.length||0
      purchasedTractor?.forEach((pr:any)=>{
    this.totalPurchaseAmount=Number(this.totalPurchaseAmount)+ Number(pr?.purchasedetail?.purchasePrice||0)
      })
            let saleTractorsAll= this.tractorArray.filter((f: any) => (f?.isSold==1 && f?.isSoldToDealer==0)|| (f?.isSoldToDealer==1 || f?.isSoldToDealer=='1') );
           let saleTractorsPeriodAtStore=  saleTractorsAll.filter((f: any) => (f?.isSold==1 && f?.isSoldToDealer==0)&&
(  new Date(f.sellingDetailedIdDetails?.sellingDate) >= new Date(this.selectedPeriod.startDate) &&
  new Date(f.sellingDetailedIdDetails?.sellingDate) <= new Date(this.selectedPeriod.endDate))
);
//console.log("saleTractorsAll.filter((f:any)=>f?.isSoldToDealer==1)",saleTractorsAll.filter((f:any)=>f?.isSoldToDealer==1),"aa",saleTractorsAll.filter((f:any)=>f?.isSoldToDealer==1 && !f?.dateOfDealerSale));
// let notIndate= saleTractorsAll.filter((f: any) => ( f?.isSoldToDealer==1)&&
// (  new Date(f.dateOfDealerSale) < new Date(this.selectedPeriod.startDate) ||
//   new Date(f.dateOfDealerSale) > new Date(this.selectedPeriod.endDate))
// );
// console.log("notIndate",notIndate);

this.totalSaleStoreNumberInp=saleTractorsPeriodAtStore?.length||0

  let saleTractorsPeriodAtFranchise=  saleTractorsAll.filter((f: any) =>{
    


  return (
    Number(f.isSoldToDealer) === 1 &&
    f.dateOfDealerSale >= this.selectedPeriod.startDate &&
    f.dateOfDealerSale <= this.selectedPeriod.endDate
  );
  }
);
this.totalSaleFranchiseNumberInp=saleTractorsPeriodAtFranchise?.length||0
let saleTractorsPeriod = [...saleTractorsPeriodAtStore, ...saleTractorsPeriodAtFranchise];
 saleTractorsPeriod?.forEach((f:any)=>{
  this.totalPurchasePriceOfSoldTractorInPeriod=Number(this.totalPurchasePriceOfSoldTractorInPeriod)+Number(f.totalExpenseT||0)
})
this.totalSaleNumberInP=saleTractorsPeriod?.length ||0
let storeSale=0;
 saleTractorsPeriodAtStore?.forEach((sale:any)=>{
  storeSale=Number(storeSale)+ Number(sale?.sellingDetailedIdDetails?.sellingPrice||0)
      })
 let saleInprofitAtStoreNumber=saleTractorsPeriodAtStore?.filter((f:any)=>f.sellingDetailedIdDetails?.sellingPrice>=f.totalExpenseT)?.length||0
 let saleInlossAtStoreNumber=saleTractorsPeriodAtStore?.filter((f:any)=>f.sellingDetailedIdDetails?.sellingPrice<f.totalExpenseT)?.length||0

 let saleInprofitAtFranciseNumber=saleTractorsPeriodAtFranchise?.filter((f:any)=>f?.dealerPrice>=f.totalExpenseT)?.length||0
 let saleInlossAtFranchisNumber=saleTractorsPeriodAtFranchise?.filter((f:any)=>f?.dealerPrice<f.totalExpenseT)?.length||0
this.saleInprofitNumber=saleInprofitAtStoreNumber+saleInprofitAtFranciseNumber
this.saleInlossNumber=saleInlossAtStoreNumber+saleInlossAtFranchisNumber

      this.totalSaleStoreAmountInp=storeSale
      let franchiseSale=0;
 saleTractorsPeriodAtFranchise?.forEach((sale:any)=>{
  franchiseSale=Number(franchiseSale)+ Number(sale?.dealerPrice||0)
      })
       this.totalSaleFranchiseAmountInp=franchiseSale
      this.totalSaleAmountInP=Number(franchiseSale)+Number(storeSale)
let profitInPeriod=this.totalSaleAmountInP-this.totalPurchasePriceOfSoldTractorInPeriod
    this.profitInPeriod=Number(((profitInPeriod).toFixed(2)) as any).toLocaleString('en-IN')
    this.averageProfit=Number(Number(profitInPeriod)/Number(this.totalSaleNumberInP)).toFixed(2)
     this.averageProfitPercent=Number((profitInPeriod/this.totalPurchasePriceOfSoldTractorInPeriod)*100).toFixed(2)
   //unsold status 
  let unSoldInPeriod= this.tractorArray?.filter((f:any)=>(f.isSold==0 && f?.isSoldToDealer==0) && (  new Date(f.reachDate) >= new Date(this.selectedPeriod.startDate) &&
  new Date(f.reachDate) <= new Date(this.selectedPeriod.endDate)))  
  this.totalUnsoleInperiod=unSoldInPeriod?.length||0
  unSoldInPeriod?.forEach((f:any)=>{
    this.totalUnsoldTractorAmountInperiod=Number(this.totalUnsoldTractorAmountInperiod)+Number(f?.purchasedetail?.purchasePrice||0)
  })

 

    let unSoldBeforePeriod = this.tractorArray.filter((f: any) =>
 (f.isSold==0 && f?.isSoldToDealer==0) &&
  new Date(f.reachDate) < new Date(this.selectedPeriod.startDate)
);
  this.totalUnsoldBeforePeriod=unSoldBeforePeriod?.length||0
  unSoldBeforePeriod?.forEach((f:any)=>{
    this.totalUnsoldTractorAmountBerfore=Number(this.totalUnsoldTractorAmountBerfore)+Number(f?.purchasedetail?.purchasePrice||0)
  })

this.totalUnsoldTractorAmount=(Number( this.totalUnsoldTractorAmountInperiod))+Number(this.totalUnsoldTractorAmountBerfore)
this.totalUnsoldTractorNumber= this.totalUnsoldBeforePeriod+ this.totalUnsoleInperiod

if(this.tractorArray?.length){
this.tractorArraySrc=JSON.parse(JSON.stringify(this.tractorArray))
}
this.totalTractor=this.tractorArraySrc?.length||0
          },


          (error: any) => {},
        );
      } else {
        this.share.presentToast('Error:End Date is less than Start Date');
      }
   
  }
totalTractor:any=0
storeSoldInP:any=0
  getDataOfStore(){
    if(this.selectedStore=='ALL'){
      this.tractorArray=JSON.parse(JSON.stringify(this.tractorArraySrc))
    }else if(this.selectedStore!='ALL'){
let tractorListAll=JSON.parse(JSON.stringify(this.tractorArraySrc))
this.tractorArray=tractorListAll?.filter((f:any)=>f?.tractordetailadmin?.wareHouseLocation==this.selectedStore)||[]


    }
  }
  tractorArraySrc:any[]=[]
    totalPurchaseAmount:any=0
  totalPurchaseNo:any=0
  totalSaleNumberInP=0
  totalSaleAmountInP=0

  totalSaleStoreNumberInp=0
  totalSaleStoreAmountInp=0
   totalSaleFranchiseNumberInp=0
  totalSaleFranchiseAmountInp=0

  totalUnsoleInperiod=0
  totalUnsoldBeforePeriod=0
  totalUnsoldTractorAmount=0
  totalUnsoldTractorAmountInperiod=0
  totalUnsoldTractorAmountBerfore=0
  totalUnsoldTractorNumber=0

  totalPurchasePriceOfSoldTractorInPeriod=0
  profitInPeriod:any=0
  averageProfit:any=0
  averageProfitPercent:any=0

  saleInprofitNumber:any=0
  saleInlossNumber:any=0

  resetValue(){
    this.totalTractor=0
    this.totalPurchaseAmount=0
    this.totalPurchaseNo=0
    this.totalSaleNumberInP=0
    this.totalSaleAmountInP=0

      this.totalSaleStoreNumberInp=0
  this.totalSaleStoreAmountInp=0
   this.totalSaleFranchiseNumberInp=0
  this.totalSaleFranchiseAmountInp=0


   this.totalUnsoleInperiod=0
  this.totalUnsoldBeforePeriod=0
  this.totalUnsoldTractorAmountInperiod=0
  this.totalUnsoldTractorAmountBerfore=0
  this.totalUnsoldTractorNumber=0

  this.totalPurchasePriceOfSoldTractorInPeriod=0
  this.profitInPeriod=0
  this.averageProfit=0
  this.averageProfitPercent=0


      this.saleInprofitNumber=0
  this.saleInlossNumber=0
  }
  getTractorsOnPeriod(tractorArray:any){
    return tractorArray.filter((f:any)=>this.selectedPeriod.startDate>=f.reachDate && this.selectedPeriod.startDate>=f.reachDate)
  }

  totalSellingCost: any = 0;
  calculateRepairCost(tractor: any) {
    //service
    let expenseServiceList = tractor?.repairServiceExpenseCost?.filter(
      (f: any) => f?.expense_head == 'EXPENSE',
    );
    let expenseServiceCost = 0;
    expenseServiceList?.forEach((f: any) => {
      expenseServiceCost = expenseServiceCost + Number(f?.total_expense);
    });
    tractor.expenseServiceCost = expenseServiceCost;
    let expenseMaterialList = tractor?.repairMaterialExpenseCost?.filter(
      (f: any) => f?.expense_head == 'EXPENSE',
    );

    // material
    let expenseMaterialCost = 0;
    expenseMaterialList?.forEach((f: any) => {
      expenseMaterialCost = expenseMaterialCost + Number(f?.total_expense);
    });

    //category wise
    let categroyWiseMaterial: any = [];
    this.allDetails?.spareList?.forEach((spare: any) => {
      let obj = {
        catName: spare.name,
        id: spare.id,
        materialList: [],
        total_amount: 0,
      };
      categroyWiseMaterial.push(obj);
    });
    expenseMaterialList?.forEach((expense: any) => {
                 if(expense?.cat_id==null || expense?.cat_id==undefined){
      let findinMatList = this.allDetails?.materialList?.find(
        (mat: any) => mat.id == expense?.expense_id,
      );
      let getCat = this.allDetails?.spareList?.find(
        (spare: any) => spare.id == findinMatList?.category,
      );
      if (getCat) {
        let findExist = categroyWiseMaterial?.findIndex(
          (cat: any) => cat.id == getCat.id,
        );
        if (findExist > -1) {
          categroyWiseMaterial[findExist].total_amount =
            Number(categroyWiseMaterial[findExist]?.total_amount) +
            Number(expense?.total_expense);
          categroyWiseMaterial[findExist]?.materialList.push(expense);
        } else {
          let obj = {
            catName: getCat?.name,
            id: getCat?.id,
            materialList: [expense],
            total_amount: expense?.total_expense || 0,
          };
          categroyWiseMaterial.push(obj);
        }
      }
    }
    else {
           let findinMatList = this.allDetails?.materialList?.find(
        (mat: any) => mat.id == expense?.expense_id,
      );
      // let getCat = this.allDetails?.spareList?.find(
      //   (spare: any) => spare.id == findinMatList?.category,
      // );
                 let getCat = this.allDetails?.spareList.find(
        (spare: any) => spare.id == expense.cat_id
      );
      if (getCat) {
        let findExist = categroyWiseMaterial?.findIndex(
          (cat: any) => cat.id == getCat.id,
        );
        if (findExist > -1) {
          categroyWiseMaterial[findExist].total_amount =
            Number(categroyWiseMaterial[findExist]?.total_amount) +
            Number(expense?.total_expense);
          categroyWiseMaterial[findExist]?.materialList.push(expense);
        } else {
          let obj = {
            catName: getCat?.name,
            id: getCat?.id,
            materialList: [expense],
            total_amount: expense?.total_expense || 0,
          };
          categroyWiseMaterial.push(obj);
        }
      }
    }
    });
    // let catMaterialTotal=0
    // categroyWiseMaterial?.forEach((catM:any)=>{
    //   catMaterialTotal=catMaterialTotal+Number(catM?.total_amount)
    // })
    tractor.categroyWiseMaterial = categroyWiseMaterial;
    //reduce
    let reduceItemTotalAmount = 0;
    tractor?.reduceItemList?.forEach((f: any) => {
      reduceItemTotalAmount = reduceItemTotalAmount + Number(f?.total_amount);
    });

    //total
    tractor.reduceItemTotalAmount = reduceItemTotalAmount;
    let totalRepairExpense =
      Number(expenseMaterialCost) + Number(expenseServiceCost);
    tractor.totalRepairExpense = totalRepairExpense;
    tractor.workshopTotalExpense =
      Number(totalRepairExpense) - Number(reduceItemTotalAmount);

    //totalExpense
    tractor.totalExpenseT =
      Number(tractor.workshopTotalExpense) +
      Number(tractor?.totalAmountBreakup);
    if (tractor?.sellingDetailedIdDetails && tractor?.isSoldToDealer == 0) {
      tractor.netSellingPrice = tractor?.sellingDetailedIdDetails?.sellingPrice;
      tractor.gm =
        Number(tractor?.sellingDetailedIdDetails?.sellingPrice) -
        Number(tractor.totalExpenseT);
      if (tractor.gm) {
        tractor.gstAmount = (Number(tractor.gm) * 18) / 118;
      }
      tractor.billingAmountWithoutGst =
        Number(tractor?.netSellingPrice) - Number(tractor?.gstAmount);
    } else {
      if (tractor?.isSoldToDealer == 1) {
        tractor.netSellingPrice = Number(tractor?.dealerPrice);
        tractor.gm =
          Number(tractor?.dealerPrice) - Number(tractor.totalExpenseT);
        if (tractor.gm) {
          tractor.gstAmount = (Number(tractor.gm) * 18) / 118;
        }
        tractor.billingAmountWithoutGst =
          Number(tractor?.netSellingPrice) - Number(tractor?.gstAmount);
      } else {
        tractor.netSellingPrice = null;
        tractor.gm = null;
        tractor.gstAmount = null;
        tractor.billingAmountWithoutGst = null;
      }
    }

    //tractor.dlpBasedEstimation=Number(tractor?.totalAmountBreakup)+Number(tractor?.maintainanceEstimationCost||0)+37000
    tractor.dlpBasedEstimation = Number(tractor?.totalAmountBreakup) + 37000;

    this.totalSellingCost = this.totalSellingCost + Number(tractor.gm);
  }
  swap(arr: any[], i: number, j: number): void {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  logisticExpenseTypeList: any = [];
  getLogisticExpense() {
    let obj: any = this.share.getListObj('expensetype', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        console.log('logisticExpenseTypeList', res.data);

        this.logisticExpenseTypeList = res.data;
        if (this.logisticExpenseTypeList?.length) {
          let findIndex = this.logisticExpenseTypeList?.findIndex(
            (f: any) => f.id == 4,
          );
          let findIndex1 = this.logisticExpenseTypeList?.findIndex(
            (f: any) => f.id == 5,
          );
          this.swap(this.logisticExpenseTypeList, findIndex, findIndex1);
        }
      },
      (error: any) => {},
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
