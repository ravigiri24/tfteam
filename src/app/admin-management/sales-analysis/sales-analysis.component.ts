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
  selector: 'app-sales-analysis',
  templateUrl: './sales-analysis.component.html',
  styleUrls: ['./sales-analysis.component.scss'],
})
export class SalesAnalysisComponent  implements OnInit {

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
     form: FormGroup;
  ngOnInit() {}
    initialize() {
      this.form = this.formBuilder.group({
        startDate: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
      });
      console.log('this.dateForm', this.form.value);
    }
  srcPage: any;
  staffDetails: any;
  ionViewWillEnter() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    if (this.form) {
      this.form.reset();
    }
  
    this.activatedRoute.params.subscribe((params: any) => {
      this.srcPage = params?.srcPage;
    });
       this.getLogisticExpense();
    this.initialize();
  }
    getLogisticExpense() {
    let obj: any = this.share.getListObj('expensetype', false, [], true);

    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        console.log("logisticExpenseTypeList",res.data);
        
        this.logisticExpenseTypeList = res.data;
        if(this.logisticExpenseTypeList?.length){
          let findIndex=this.logisticExpenseTypeList?.findIndex((f:any)=>f.id==4)
          let findIndex1=this.logisticExpenseTypeList?.findIndex((f:any)=>f.id==5)
          this.swap(this.logisticExpenseTypeList, findIndex, findIndex1);

        }
      },
      (error: any) => {}
    );
  }
   swap(arr: any[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

  genrateReport(){
this.getSalesReport()
  }
  showData=false
  reportDatesRecord:any
  allDetails:any
  tractorArray:any=[]
  getSalesReport(){
    this.showData=false
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
        this.api.postapi('getSalesReportByDate', obj).subscribe(
          (res: any) => {
            this.allDetails = res?.data;
             this.allDetails.spareList= this.allDetails.spareList.reverse()
            this.tractorArray = res?.data?.tractorList;
            this.tractorArray=this.tractorArray.reverse()
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
              
              
              });
                tractor.logisticExpense = logisticExpense;
                console.log('logisticExpense', logisticExpense);
                if(tractor?.purchasedetail?.purchasePrice>0){
               totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.purchasedetail?.purchasePrice)
                }
               // if(tractor?.rtoDetails){
                if(tractor?.rto_cost>0){
                  totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.rto_cost)
                }
                   if(tractor?.insurance_cost>0){
                  totalAmountBreakup=Number(totalAmountBreakup)+Number(tractor?.insurance_cost)
                } 
                //}
                tractor.totalAmountBreakup=totalAmountBreakup
                //need to call at last for all calculation
                this.calculateRepairCost(tractor)
            });
            // this.createReport();
            console.log("tractorArray",this.tractorArray);
            
            this.share.spinner.dismiss();
            setTimeout(() => {
              this.showData=true
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
    calculateRepairCost(tractor:any){
    //service 
        let expenseServiceList = tractor?.repairServiceExpenseCost?.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );
      let  expenseServiceCost=0
        expenseServiceList?.forEach((f: any) => {
        expenseServiceCost =
        expenseServiceCost + Number(f?.total_expense);
       
    });
     tractor.expenseServiceCost=expenseServiceCost
   let expenseMaterialList = tractor?.repairMaterialExpenseCost?.filter(
          (f: any) => f?.expense_head == 'EXPENSE'
        );

     // material   
       let expenseMaterialCost=0
  expenseMaterialList?.forEach((f: any) => {
      expenseMaterialCost =
        expenseMaterialCost + Number(f?.total_expense);
    });

    //category wise 
   let  categroyWiseMaterial:any=[]   
   this.allDetails?.spareList?.forEach((spare:any)=>{
  let obj = {
            catName: spare.name,
            id: spare.id,
            materialList: [],
            total_amount: 0,
          };
            categroyWiseMaterial.push(obj)
   })
       expenseMaterialList?.forEach((expense: any) => {
      let findinMatList = this.allDetails?.materialList?.find(
        (mat: any) => mat.id == expense?.expense_id
      );
      let getCat = this.allDetails?.spareList?.find(
        (spare: any) => spare.id == findinMatList?.category
      );
      if (getCat) {
        let findExist = categroyWiseMaterial?.findIndex(
          (cat: any) => cat.id == getCat.id
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
            total_amount: expense?.total_expense||0,
          };
          categroyWiseMaterial.push(obj);
        }
      }
    });
    // let catMaterialTotal=0
    // categroyWiseMaterial?.forEach((catM:any)=>{
    //   catMaterialTotal=catMaterialTotal+Number(catM?.total_amount)
    // })
     tractor.categroyWiseMaterial=categroyWiseMaterial
     //reduce
   let reduceItemTotalAmount=0
  tractor?.reduceItemList?.forEach((f: any) => {
      reduceItemTotalAmount =
        reduceItemTotalAmount + Number(f?.total_amount);
    });

//total
    tractor.reduceItemTotalAmount=reduceItemTotalAmount
      let totalRepairExpense= Number(expenseMaterialCost)+Number(expenseServiceCost)
      tractor.totalRepairExpense=totalRepairExpense
tractor.workshopTotalExpense=Number(totalRepairExpense)-Number(reduceItemTotalAmount)

//totalExpense
tractor.totalExpenseT=Number(tractor.workshopTotalExpense)+Number(tractor?.totalAmountBreakup)
if(tractor?.sellingDetailedIdDetails && tractor?.isSoldToDealer==0){

  tractor.netSellingPrice=tractor?.sellingDetailedIdDetails?.sellingPrice
  tractor.gm=Number(tractor?.sellingDetailedIdDetails?.sellingPrice)-Number(tractor.totalExpenseT)
  if( tractor.gm){
    tractor.gstAmount=Number(tractor.gm)*18/118
  }
  tractor.billingAmountWithoutGst=Number( tractor?.netSellingPrice)-Number(tractor?.gstAmount)

}else{
    if(tractor?.isSoldToDealer==1){
  tractor.netSellingPrice=Number(tractor?.dealerPrice)
    tractor.gm=Number(tractor?.dealerPrice)-Number(tractor.totalExpenseT)
      if( tractor.gm){
    tractor.gstAmount=Number(tractor.gm)*18/118
  }
  tractor.billingAmountWithoutGst=Number( tractor?.netSellingPrice)-Number(tractor?.gstAmount)
  }else{
       tractor.netSellingPrice=null
   tractor.gm=null
   tractor.gstAmount=null
  tractor.billingAmountWithoutGst=null
  }

}

//tractor.dlpBasedEstimation=Number(tractor?.totalAmountBreakup)+Number(tractor?.maintainanceEstimationCost||0)+37000
tractor.dlpBasedEstimation=Number(tractor?.totalAmountBreakup)+37000
this.totalSellingCost=this.totalSellingCost+Number(tractor.gm)
  }
  totalSellingCost:any=0
    logisticExpenseTypeList: any = [];
    backToDashboard() {
    this.router.navigate([this.srcPage]);
  }
}
