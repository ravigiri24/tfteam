import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from 'src/app/shared-components/tractor-dashboard/tractor-dashboard.component';
import { Router } from '@angular/router';
import { TractorSellsDetailsComponent } from 'src/app/tractor-sells-details/tractor-sells-details.component';
import { SyncTractorWithMaintaninanceComponent } from 'src/app/shared-components/sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SelectListTypeComponent } from 'src/app/shared-components/select-list-type/select-list-type.component';
import { TractorFinanceDetailsComponent } from 'src/app/tractor-finance-details/tractor-finance-details.component';
import { NocUpdateComponent } from '../rto-noc/noc-update/noc-update.component';
import { NocViewOptionsComponent } from '../rto-noc/noc-view-options/noc-view-options.component';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
import { RtoOptionsComponent } from '../rto-options/rto-options.component';
import { RtoDetailsFormComponent } from '../rto-details-form/rto-details-form.component';
import { DocsOptionsComponent } from './docs-options/docs-options.component';
import { RtoDocsDetailsComponent } from '../rto-docs-details/rto-docs-details.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-rto-sold-process',
  templateUrl: './rto-sold-process.component.html',
  styleUrls: ['./rto-sold-process.component.scss'],
})
export class RtoSoldProcessComponent  implements OnInit {

   constructor(
     private api: ApiService,
     private share: ShareService,
     private modalCtrl: ModalController,
     private router: Router,
     private commonMethod:CommonMethodService,
     private route:Router
   ) {}
   alltractorList: any = [];
   optionsArray = [
     { displayName: 'All', value: 'ALL' },
     { displayName: 'Not Filled', value: 'NOT_FILLED' },
     { displayName: 'Filled', value: 'FILLED' },
   
   ];
   ngOnInit() {}
   ionViewWillEnter() {
     this.alltractorList = [];
     this.getBrandList();
     this.getWareHouseList();
     this.filterBy = 'ALL';
     this.listBy = 'BRAND_WISE';
     // this.getTractorList();
   }
   filterBy: any = 'ALL';
   async presentModal() {
     const modal = await this.modalCtrl.create({
       component: SelectListTypeComponent,
       breakpoints: [0, 0.4, 1],
       initialBreakpoint: 0.4,
       cssClass: 'custom-modal',
       componentProps: {
         filterBy: this.filterBy,
         filterByTitle: 'Is NOC',
         listBy: this.listBy,
         showFilter: true,
         optionsArray: this.optionsArray,
       },
     });
     await modal.present();
     const { data, role } = await modal.onWillDismiss();
     if (data && data?.isFilterChange) {
       console.log('data', data);
       this.filterBy = data?.filterBy;
       this.sortByFilter();
     }
     if (data && data?.isListChange) {
       console.log('data', data);
       this.listBy = data?.listBy;
       this.callListApi();
     }
   }
   
   
     
   listBy = 'BRAND_WISE';
   refreshList() {
     this.getTractorList();
   }
   getListByBrand() {
     console.log('getListByBrand', this.selectedBrand);
     this.getTractorList(true);
   }
   async salesOption(tractor: any) {
     // const modal = await this.modalCtrl.create({
     //   component: FinanceOptionsComponent,
     //   componentProps: {
     //     tractor: tractor,
     //   },
     // });
     // await modal.present();
     // const { data, role } = await modal.onWillDismiss();
     // console.log('role', role);
   }
  
   search = {
     registractionNo: null,
   };
   brandList: any = [];
   selectedBrand: any;
   getBrandList(loader: any = false) {
     let staffDetails: any = this.share.get_staff();
 
     this.staffDetails = JSON.parse(staffDetails);
     //if(loader){
     this.share.showLoading('Loading...');
     // }
     let obj: any = this.share.getListObj('brand', false, [], true);
     obj.storeId = this.staffDetails?.storeId;
 
     setTimeout(() => {
       this.api.postapi('getList', obj).subscribe(
         (res: any) => {
           this.brandList = res?.data;
           this.brandList = this.brandList.reverse();
 
           console.log('  this.brandList', this.brandList);
           if (!loader) {
             this.selectedBrand = this.brandList[0]?.id;
 
             this.getTractorList();
             //   this.share.spinner?.dismiss();
           }
         },
         (error: any) => {}
       );
     }, 0);
   }
   staffDetails: any;
   async syncManitainance(tractor: any) {
     const modal = await this.modalCtrl.create({
       component: SyncTractorWithMaintaninanceComponent,
       componentProps: {
         tractor: tractor,
       },
     });
     await modal.present();
     await modal.present();
 
     const { data, role } = await modal.onWillDismiss();
   }
   allTractorsSrcList: any = [];
   getTractorList(loader: any = false) {
     let staffDetails: any = this.share.get_staff();
     this.staffDetails = JSON.parse(staffDetails);
 
     if (!this.selectedBrand) {
       this.selectedBrand = this.brandList[0]?.id;
     }
     let obj = {
       operate: this.staffDetails?.staffCode,
       isLive: true,
       brandId: this.selectedBrand,
          isDraft:true
     };
     if (loader) {
       this.share.showLoading('Loading...');
     }
 
     this.api.postapi('getTractorListBranchWiseisLive', obj).subscribe(
       (res: any) => {
         this.alltractorList = res?.data;
         this.allTractorsSrcList = res?.data;
         // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
         this.sortByFilter();
         this.share.spinner.dismiss('active_two');
         this.backupList = res.data;
       },
       (error: any) => {}
     );
   }
   getAllTractorList(loader: any = false) {
     let staffDetails: any = this.share.get_staff();
     this.staffDetails = JSON.parse(staffDetails);
 
     let obj = {
       operate: this.staffDetails?.staffCode,
       isLive: true,
     };
     //if (loader) {
     this.share.showLoading('Loading...');
     // }
     this.api.postapi('getTractorListLive', obj).subscribe(
       (res: any) => {
         this.alltractorList = res?.data;
         this.allTractorsSrcList = res?.data;
         // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
         this.sortByFilter();
         this.share.spinner.dismiss('active_two');
         this.backupList = res.data;
       },
       (error: any) => {}
     );
   }
   selectedStore: any;
   warehouseList: any = [];
   getWareHouseList(loader: any = false) {
     let staffDetails: any = this.share.get_staff();
 
     this.staffDetails = JSON.parse(staffDetails);
     //if(loader){
     // this.share.showLoading('Loading...');
     // }
     let obj: any = this.share.getListObj('warehouselocation', false, [], true);
     obj.storeId = this.staffDetails?.storeId;
 
     setTimeout(() => {
       this.api.postapi('getList', obj).subscribe(
         (res: any) => {
           this.warehouseList = res?.data;
           this.warehouseList = this.warehouseList.reverse();
 
           console.log('this.warehouseList', this.warehouseList);
           if (!loader) {
             this.selectedStore = this.warehouseList[0]?.id;
 
             //  this.getAllTractorListStorewise();
             //   this.share.spinner?.dismiss();
           }
         },
         (error: any) => {}
       );
     }, 0);
   }
   callListApi() {
     this.filterBy = 'ALL';
     if (this.listBy == 'ALL') {
       this.getAllTractorList();
     } else if (this.listBy == 'BRAND_WISE') {
       this.getTractorList(true);
     } else if (this.listBy == 'STORE_WISE') {
       this.getAllTractorListStorewise();
     }
   }
   sortByFilter() {
     let date = new Date('04/01/2025');
     console.log('New', new Date('01/01/2022'));
     if (this.filterBy == 'ALL') {
       this.alltractorList = this.allTractorsSrcList.filter(
         (f: any) => new Date(f?.createdOn) >= date && f?.isSold==1
       );
     } else if (this.filterBy == 'NOT_FILLED') {
       this.alltractorList = this.allTractorsSrcList.filter(
         (f: any) => new Date(f?.createdOn) >= date &&  f?.isSold==1 && f?.rtoDetailsId==null
       );
     } else if (this.filterBy == 'FILLED') {
       this.alltractorList = this.allTractorsSrcList.filter(
         (f: any) => new Date(f?.createdOn) >= date && f?.isSold == 1 && f?.rtoDetailsId!=null
       );
     } 
   }
   getAllTractorListStorewise(loader: any = false) {
     let staffDetails: any = this.share.get_staff();
     this.staffDetails = JSON.parse(staffDetails);
     if (!this.selectedStore) {
       this.selectedStore = this.warehouseList[0]?.id;
     }
     let obj = {
       operate: this.staffDetails?.staffCode,
       store_id: this.selectedStore,
     };
     //if (loader) {
     this.share.showLoading('Loading...');
     //}
     this.api.postapi('getTractorsListStoreWise', obj).subscribe(
       (res: any) => {
         this.alltractorList = res?.data;
         this.allTractorsSrcList = res?.data;
         // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
 
         this.sortByFilter();
         this.share.spinner.dismiss('active_two');
         this.backupList = res.data;
       },
       (error: any) => {}
     );
   }
   async viewImage(tractor: any) {
     // const modal = await this.modalCtrl.create({
     //   component: ImageViewerComponent,
     //   componentProps: {
     //     tarctor_id: tractor.id,
     //   },
     // });
     // await modal.present();
     // const { data, role } = await modal.onWillDismiss();
     // console.log('role', role);
     // if (role === 'confirm') {
     // }
   }

   backupList: any = [];
   tractorDashboard(tractor: any) {
     this.router.navigate([
       '/operational/view-dashboard',
       tractor?.id,
       '/operational/all-tractor-management',
     ]);
   }
   async searchTractor() {
     const modal = await this.modalCtrl.create({
       component: SearchTractorWithTfCodeComponent,
       componentProps: {
     
     buttonArray: this.buttonArray,
       keyList:this.keyList,
       searchFilter:this.search,
       searchKey:'registractionNo',
     obj:{optionsArray:this.optionsButtonArray,optionsUploadButtonArray:this.optionsUploadButtonArray}
      
       },
     });
     await modal.present();
     const { data, role } = await modal.onWillDismiss();
     console.log('role', role);
 
     if (role === 'confirm') {
     }
   }
   keyList: any = [
     { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
         { key: 'Noc Availaible ', value: 'isNoc', type: 'CONDITIONAL' },
     { key: 'Is Sold ', value: 'isSold', type: 'CONDITIONAL' },
     { key: 'New RC Done ', value: 'isrtoDone',getFromObj:true,objName:'rtoDetailsIdDetails', type: 'CONDITIONAL' },
     { key: 'Manufactoring', value: 'yearOfManufactoring', type: 'INPUT' },
     { key: 'Hours', value: 'hours', type: 'INPUT' },
     { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
   ];
 
   buttonArray: any = [
     {
       name: 'Add RTO Details',
       action: 'addRTODetails',
       image: './././assets/images/log-in.png',
     },
          {
       name: 'RTO Expense',
       action: 'addRTOExpense',
       closeCurrentPopUP:true,
       image: './././assets/images/accounting.png',
     },
       {
       name: 'View Details RTO',
       action: 'viewDetailsRtoSales',
       image: './././assets/images/online-survey.png',
     },
        {
       name: 'Download Docs',
       action: 'downloadDocs',
       image: './././assets/images/visual.png',
     },
     
   ];
     optionsUploadButtonArray: any = [
     {
      functionName: 'rcUpdate',
      optionsName: 'RC Update',
      type: 'FUNCTION_CALL',
   closePopUp:true,
      funcName : 'rcUpdate',
      icon: '././assets/images/identity-card.png',
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Upload Documents',
      showHeading: 'Upload Documents',
      param: 'DOCUMENT_RTO',
      showDeleteButton: true,
      uploadPhoto: true,
      type: 'IMAGE',
      icon: '././assets/images/google-docs.png',
    },
     {
      functionName: 'goToUplodeSection',
      optionsName: 'Upload Insurance',
      showHeading: 'Upload Insurance',
      param: 'INSURANCE_RTO',
      showDeleteButton: true,
      uploadPhoto: true,
      type: 'IMAGE',
      icon: '././assets/images/insurance.png',
    },
     {
      functionName: 'goToUplodeSection',
      optionsName: 'Upload RC (Before Transfer)',
      showHeading: 'Upload RC (Before Transfer)',
      param: 'RC_OLD_RTO',
      showDeleteButton: true,
      uploadPhoto: true,
      type: 'IMAGE',
      icon: '././assets/images/credit-card.png',
    },
      {
      functionName: 'goToUplodeSection',
      optionsName: 'Upload RC (After Transfer)',
      showHeading: 'Upload RC (After Transfer)',
      param: 'RC_NEW_RTO',
      showDeleteButton: true,
      uploadPhoto: true,
      type: 'IMAGE',
      icon: '././assets/images/money.png',
    },
   
  ];
  optionsButtonArray: any = [
    {
      functionName: 'seeSellDetails',
      optionsName: 'Sales Details',
      type: 'FUNCTION_CALL',
   
      funcName : 'seeSellDetails',
      icon: '././assets/images/sale-tag.png',
    },
    {
      functionName: 'seeFinanceDetails',
      optionsName: 'Finance Details',
      type: 'FUNCTION_CALL',
         funcName : 'seeFinanceDetails',
      icon: '././assets/images/get-money.png',
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Sale Dead(Pic)',
      showHeading: 'View Sale Dead',
      param: 'SALE_DEAD',
      showDeleteButton: false,
      uploadPhoto: false,
      type: 'IMAGE',
      icon: '././assets/images/envelope.png',
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Adhar Card(Pic)',
      showHeading: 'View  Adhar Card',
      param: 'ADHAR_CARD',
      type: 'IMAGE',
      icon: '././assets/images/identity-card.png',
      showDeleteButton: false,
      uploadPhoto: false,
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Pan Card(Pic)',
      showHeading: 'View Pan Card',
      param: 'PAN_CARD',
      type: 'IMAGE',
      icon: '././assets/images/pass.png',
      showDeleteButton: false,
      uploadPhoto: false,
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Bahi Khata(Pic)',
      showHeading: 'View Bahi Khata',
      param: 'BAHI_KHATA',
      type: 'IMAGE',
      icon: '././assets/images/identification-card.png',
      showDeleteButton: false,
      uploadPhoto: false,
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Form 34',
      showHeading: 'View Form 34',
      param: 'FORM_34',
      type: 'IMAGE',
      icon: '././assets/images/online-survey.png',
      showDeleteButton: false,
      uploadPhoto: false,
    },
    {
      functionName: 'goToUplodeSection',
      optionsName: 'Finance Documents(Pic)',
      showHeading: 'View Finance Documents',
      param: 'FINANCE_DOCUMENTS',
      type: 'IMAGE',
      icon: '././assets/images/envelope.png',
      showDeleteButton: false,
      uploadPhoto: false,
    },
  ];
  async actionEventCall(e: any) {
     console.log('actionEventCall', e);
          await  this.commonMethod.actionEventCall(e,{optionsArray:this.optionsButtonArray,optionsUploadButtonArray:this.optionsUploadButtonArray})
//        if (e?.button?.name != 'RTO Expense') {
//      await  this.commonMethod.actionEventCall(e)
//     }else if(e?.button?.name == 'RTO Expense'){
// this.addRTOExpense(e?.tractor)
//     }
  
    
  if(this.commonMethod.reloadMethod){
    this.callListApi()
  }
    //  if (e?.button?.name == 'Add RTO Details') {
    //    this.addRTODetails(e?.tractor);
    //  }
    //  if (e?.button?.name == 'View Details') {
    //    this.viewDetails(e?.tractor);
    //  }
    //       if (e?.button?.name == 'Download Docs') {
    //    this.downLoadDocs(e?.tractor);
    //  }
     
   }

  async addRTOExpense(tractor:any){
   
    this.route.navigate(['/rto-department/add-rto-cost', tractor?.id]);
  
  }
   async salesDetails(tractor: any) {
     const modal = await this.modalCtrl.create({
       component: ShowSalesDetailsComponent,
       componentProps: {
         tractor: tractor,
       },
     });
     await modal.present();
     const { data, role } = await modal.onWillDismiss();
     console.log('role', role);
   }
}
