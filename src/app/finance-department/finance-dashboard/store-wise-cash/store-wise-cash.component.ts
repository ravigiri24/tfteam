import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { ShareService } from 'src/app/share.service';
import { TractorCashHistoryComponent } from './tractor-cash-history/tractor-cash-history.component';
@Component({
  selector: 'app-store-wise-cash',
  templateUrl: './store-wise-cash.component.html',
  styleUrls: ['./store-wise-cash.component.scss'],
})
export class StoreWiseCashComponent  implements OnInit {


  /** Current month through April 2025, newest first. */
  monthWiseArray: any= [];

  constructor(private router:Router,public share:ShareService,private api:ApiService,private commonMethod:CommonMethodService,private modalCtrl:ModalController) { }

    ionViewWillEnter() {
  //  this.monthWiseArray = this.getMonthsFromCurrentToApril2025();
  //   this.monthWiseArray?.forEach((element:any) => {
  //     element.id=element.name
  //   });
  //   this.optionsArray=this.monthWiseArray
    this.selectedItem=this.optionsArray[0]?.id
    console.log("this.optionsArray",this.optionsArray);
    this.warehouseList=[]
this.getWareHouseList()


  }
    warehouseList: any = [];
  getWareHouseList() {
    let staffDetails: any = this.share.get_staff();

    this.staffDetails = JSON.parse(staffDetails);

    this.share.showLoading('Loading...');

    let obj: any = this.share.getListObj('warehouselocation', false, [], true);
    obj.storeId = this.staffDetails?.storeId;

    setTimeout(() => {
      this.api.postapi('getList', obj).subscribe(
        (res: any) => {
          this.warehouseList = res?.data;
          this.optionsArray = res?.data;
          this.warehouseList = this.warehouseList.reverse();
          this.share.spinner.dismiss();
        },
        (error: any) => { }
      );
    }, 0);
  }
  ngOnInit() {
 
    
  }
    actionEventHeader(e: any) {
    if (e?.name == 'Back') {
      this.backToDashboard();
    } 
  }
    async actionEventCall(e: any) {
    if (e?.button?.action === 'cashHistory') {
      const modal = await this.modalCtrl.create({
        component: TractorCashHistoryComponent,
        cssClass: 'light-modal',
        componentProps: { tractorDetails: e.tractor },
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data) {
        this.getTractorListStorwiseFinance();
      }
      return;
    }
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });

    if (this.commonMethod.reloadMethod) {
      this.getTractorListStorwiseFinance();
    }

    console.log('actionEventCall', e);
  }
    buttonArray: any = [
    {
      name: 'Cash History',
      action: 'cashHistory',
      image: './././assets/images/visual.png',
    }
 
  ];
    search = {
    registractionNo: null,
  };
    keyList: any = [
     {
      key: 'Year Of Manufactoring',
      value: 'yearOfManufactoring',
      type: 'INPUT',
    },
    { key: 'Registration Number', value: 'registractionNo', type: 'INPUT' },
   
    { key: 'Hours', value: 'hours', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
    listColorClass = 'sevenColor';
  tractorList:any=[]
  selectedItem:any
    optionActionEvent(e: any) {
    console.log('optionActionEvent', e);
    this.selectedItem = e;
    this.getTractorListStorwiseFinance();
  }
  expandListEvent(){

  }
  staffDetails:any
  getTractorListStorwiseFinance(){
    let getSelectedObj=this.optionsArray.find((f:any)=>f.id==this.selectedItem)
   let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      store_id:this.selectedItem,
   
    };
    this.share.showLoading("Getting Data");
    this.api.postapi('getTractorListStorwiseFinance', obj).subscribe(
      (res: any) => {
        this.tractorList = res.data?.tractorList;
        this.allFilterList = res?.data?.tractorList;
      this.tractorList?.forEach((f:any)=>{
        if(!f?.name){
          f.name='Not Found'
        }
      })
        this.share.spinner.dismiss();
      },
      (error: any) => {},
    );
  }
     dismiss() {
    return this.modalCtrl.dismiss(null);
  }
  srcPage: any;
  backToDashboard() {
    this.router.navigate(['/finance-department/finance-dashboard'])
  }
  optionsArray:any=[]
allFilterList:any=[]
  headerDisplayArray = [
    { name: 'Back', icon: 'arrow-back-outline' },
  ];
  private getMonthsFromCurrentToApril2025(): Array<{ name: string; startDate: string; endDate: string }> {
    const months: Array<{ name: string; startDate: string; endDate: string }> = [];
    const currentMonth = new Date();
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(2025, 3, 1); // April is month index 3

    for (const date = startDate; date >= endDate; date.setMonth(date.getMonth() - 1)) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthNumber = String(month + 1).padStart(2, '0');
      const lastDay = String(new Date(year, month + 1, 0).getDate()).padStart(2, '0');

      months.push({
        name: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        startDate: `${year}-${monthNumber}-01`,
        endDate: `${year}-${monthNumber}-${lastDay}`
      });
    }

    return months;
  }

}
