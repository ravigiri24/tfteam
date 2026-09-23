import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
@Component({
  selector: 'app-upload-data-finance',
  templateUrl: './upload-data-finance.component.html',
  styleUrls: ['./upload-data-finance.component.scss'],
})
export class UploadDataFinanceComponent implements OnInit {
  @Input() tractorDetails: any;
  @Input() listColorClass: any = 'sevenColor';

  // This is the object used by every static ngModel input in the template.
  financeData: any = {};
  financeDetails: any;
  isLoading = false;

  constructor(private modalControl: ModalController, private share: ShareService, private api: ApiService) {}

  ngOnInit() {
        let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);
    this.tractorDetails = this.tractorDetails || {};
    this.tractorDetails.uploadedData = this.tractorDetails.uploadedData || {};
    if (this.tractorDetails?.financeDetailedId) {
      this.getFinanceDataById();

    } else {
      this.workedOnData = JSON.parse(JSON.stringify(this.tractorDetails?.uploadedData || {}));
      this.setData()
      this.getCityList(true)
      this.getfinancerList(false,true)
    }
  }
     async openCrudManagement(type: any = 'BANK_DETAILS') {
          const modal = await this.modalControl.create({
            component: CrudPopupComponent,
            cssClass: 'light-modal',
            componentProps: {
              type: type,
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          if (type == 'BANK_DETAILS') {
            this.getfinancerList(true);
          }
          console.log('role', role);
        }
      financerListAll: any = [];
  getfinancerList(loader: any = false,assignValue:any=false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('bank', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.financerListAll = res?.data;
           this.setFinanceDataWithNewFinancer(assignValue)
        if (loader) {
       
          this.share.spinner.dismiss();
        }
      },
      (error: any) => {},
    );
  }
     setFinanceDataWithNewFinancer(assignValue:any=false){
   

    let financer:any=null
if(this.tractorDetails.uploadedData?.Financer_Name && assignValue ){
  financer = this.financerListAll.find((f: any) => {
  const name1 = f.name?.toLowerCase() || '';
  const name2 = this.tractorDetails.uploadedData?.Financer_Name?.toLowerCase() || '';

  return name1.includes(name2) || name2.includes(name1);


})
  
      //if(!tractor?.financeDetailedId){
        this.workedOnData.bankId=financer?.id

}
    }
      sendObj(){
        if(this.workedOnData?.isFinanceAmountReceived ==undefined){
          this.workedOnData.isFinanceAmountReceived =null;
        }
      if(this.tractorDetails?.financeDetailedId){
return {
  bankId:this.workedOnData?.bankId || null,
  finance_start_date:this.workedOnData?.finance_start_date || null,
    isFIDone:this.workedOnData?.isFIDone || null,
  customerName:this.workedOnData?.customerName || null,
  mobileNo:this.workedOnData?.mobileNo || null,
    village:this.workedOnData?.village || null,
  state_id:4,
  city_id:this.workedOnData?.city_id || null,
  customer_type:this.workedOnData?.customer_type || null,
  
  dealPrice:this.workedOnData?.deal_price || null,//
  financeAmount:this.workedOnData?.financeAmount || null,
  first_disbursal:this.workedOnData?.finance_received || null,//
  first_disbursal_date:this.workedOnData?.finance_received_date || null,//
  remark:this.workedOnData?.finance_remark || null,//
  cash_received:this.workedOnData?.downPayment || null,//
  isFinanceAmountReceived:this.workedOnData?.isFinanceAmountReceived  ,
  downPayment:Number(this.workedOnData?.deal_price)-Number(this.workedOnData?.financeAmount) || null,
 

  isOneTimePayment:true,
  actionByid:this.staffDetails?.id,
  tractorID:this.tractorDetails?.id,
  id : this.tractorDetails?.financeDetailedId
  

}}
     else{
 return {
  bankId:this.workedOnData?.bankId || null,
  finance_start_date:this.workedOnData?.finance_start_date || null,
  isFIDone:this.workedOnData?.isFIDone || null,
  customerName:this.workedOnData?.customerName || null,
  mobileNo:this.workedOnData?.mobileNo || null,
  village:this.workedOnData?.village || null,
  state_id:4,
  city_id:this.workedOnData?.city_id || null,
  customer_type:this.workedOnData?.customer_type || null,

  dealPrice:this.workedOnData?.deal_price || null,//
  financeAmount:this.workedOnData?.financeAmount || null,
  first_disbursal:this.workedOnData?.finance_received || null,//
  first_disbursal_date:this.workedOnData?.finance_received_date || null,//
  remark:this.workedOnData?.finance_remark || null,//
  cash_received:this.workedOnData?.downPayment || null,//
  isFinanceAmountReceived:this.workedOnData?.isFinanceAmountReceived || null,
  downPayment:Number(this.workedOnData?.deal_price)-Number(this.workedOnData?.financeAmount) || null,
  isOneTimePayment:true,
  actionByid:this.staffDetails?.id,
  tractorID:this.tractorDetails?.id,


}

      }
    }
    saveNew(){
    
      let obj = this.sendObj();
if(obj?.bankId>0 && obj?.finance_start_date && obj?.dealPrice>0 && obj?.financeAmount ){
      this.share.showLoading('Saving...');
      this.api.postapi('addUploadedFinanceDetails', obj).subscribe(
        (res: any) => {
          this.tractorDetails.financeDetailedId = res?.data;
          this.getFinanceDataById()
          this.share.spinner.dismiss();

          this.share.presentToast('Saved Succssfully...');
          this.modalControl.dismiss(true);
        },
        (error: any) => {},
      );
    }else{
      this.share.presentToast("Please Fill Required Details")
    }
  
    }
    update(){
   
      let obj = this.sendObj();
      if(obj?.bankId>0 && obj?.finance_start_date && obj?.dealPrice>0 && obj?.financeAmount ){
      this.share.showLoading('Updating data...');
      this.api.postapi('updateUploadedFinanceDetails', obj).subscribe(
        (res: any) => {
          this.share.spinner.dismiss();
          this.share.presentToast('Updated Successfully...');
          this.modalControl.dismiss(true);
        },
        (error: any) => {
          this.share.spinner.dismiss();
          this.share.presentToast('Error...');
        },
      );
    }
      else{
      this.share.presentToast("Please Fill Required Details")
    }
   
    }
    saveData(){
      if(!this.tractorDetails?.financeDetailedId){
this.saveNew()
      }else{
this.update()
      }
    }
    staffDetails:any
  cityList: any = [];
  cityName:any
  getCityList(getFromName:any=false) {
    let obj = this.share.getListObj('city_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.cityList = res?.data;
         let find
        if(getFromName){
   find = this.cityList.find(
  (d: any) =>
    d.name?.toLowerCase().includes(
      this.tractorDetails?.uploadedData?.cityName?.toLowerCase().trim()
    )
);
        }else{
find= this.cityList.find((d:any)=>d.id==this.workedOnData.city_id) 
        }
      this.getCityListFilter()
        if(find){
          this.cityName = find?.name;
          this.workedOnData.city_id = find?.id;
        } 
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  cityListFilter: any = [];
  getCityListFilter() {
    let getStateId = 4;
    let cityList = this.cityList.filter((f: any) => f.state_id == getStateId);
    this.cityListFilter = cityList;
  }
  checkOpenCon(itemName: any) {
    if (itemName == 'State') {
      return true;
    } else if (itemName == 'City'
    ) {
      if(this.cityListFilter?.length){
        return true;
      }else{
        this.getCityListFilter()
   
        return true;
      }
   
    } else {
      return false;
    }
  }
   async selectItem(list: any, itemName: any, table_name: any) {
        let openStatus = this.checkOpenCon(itemName);
        if(openStatus){
    
       
        let otherObjects: any;
        if (itemName == 'City') {
          list=this.cityListFilter
          otherObjects = {
            state_id: 4,
          };
        }
    
        const modal = await this.modalControl.create({
          component: SelectWithSearchComponent,
          componentProps: {
            list: list,
            itemName: itemName,
            table_name: table_name,
            otherObjects: otherObjects,
            jsonKey:'name',
            search:  {
              name: null,
            }
          },
        });
        await modal.present();
    
        const { data, role } = await modal.onWillDismiss();
        if (itemName == 'State') {
          // if (data) {
          //   this.financeForm.controls['state_id'].setValue(data?.id);
          //   this.financeForm.controls['city_id'].setValue(null);
          //   this.cityName = null;
          //   this.stateName = data?.name;
          //   this.getCityListFilter();
          // }
        } else if (itemName == 'City' && data) {
          this.cityName = data?.name;
          this.workedOnData.city_id=data?.id;
          //this.getCityList()
    
        }
        console.log('role', role, data);
    
        if (role === 'confirm') {
        }
      }else{
        this.share.presentToast("Please Select State First")
      }
      }
   
  setData(){
    this.workedOnData.finance_start_date = this.convertDate(this.workedOnData.finance_start_date);
    // this.workedOnData.isFIDone=null;
    // this.workedOnData.isFinanceAmountReceived=false;

    this.tractorDetails.uploadedData.finance_start_date = this.convertDate(this.tractorDetails.uploadedData.finance_start_date);
  }
  convertDate(date: string): string {
  if (!date) return '';

  if (date.includes('-')) return date;
  const [day, month, year] = date.split('/');

  return `${year}-${month}-${day}`;
}
  workedOnData: any = {};
  dismiss() { return this.modalControl.dismiss(null); }

  save() {
    const payload = this.sendObj();
    if (!payload) {
      this.share.presentToast('Unable to prepare finance data');
      return;
    }

    const endpoint = this.tractorDetails?.financeDetailedId
      ? 'updateFinanceDetails'
      : 'addFinanceDetails';

    this.share.showLoading('Saving finance data...');
    this.api.postapi(endpoint, payload).subscribe(
      (response: any) => {
        if (!this.tractorDetails.financeDetailedId) {
          this.tractorDetails.financeDetailedId = response?.data;
        }
        this.share.spinner.dismiss();
        this.share.presentToast('Finance data saved successfully');
        this.modalControl.dismiss(true);
      },
      () => {
        this.share.spinner.dismiss();
        this.share.presentToast('Unable to save finance data');
      },
    );
  }

  private getFinanceDataById() {
    this.isLoading = true;
    const request: any = this.share.getStaffObj();
    request.finance_id = this.tractorDetails.financeDetailedId;
   this.share.showLoading("Loading Data")
    this.api.postapi('getFinanceDataById', request).subscribe(
      (response: any) => {
        this.share.spinner.dismiss()

        this.tractorDetails.financeDetails = response?.data || {};
        if(this.tractorDetails?.financeDetails){
              this.workedOnData=this.tractorDetails?.financeDetails
   
            this.workedOnData.deal_price=this.tractorDetails?.financeDetails?.dealPrice
  this.workedOnData.finance_received=this.tractorDetails?.financeDetails?.first_disbursal
  this.workedOnData.finance_received_date=this.tractorDetails?.financeDetails?.first_disbursal_date
  this.workedOnData.finance_remark=this.tractorDetails?.financeDetails?.remark
  this.workedOnData.downPayment=this.tractorDetails?.financeDetails?.cash_received
 if(this.tractorDetails?.financeDetails?.isFinanceAmountReceived==1){
 this.workedOnData.isFinanceAmountReceived=true
 }else if(this.tractorDetails?.financeDetails?.isFinanceAmountReceived==0){
this.workedOnData.isFinanceAmountReceived=false
 }

              this.getCityList()
                this.getfinancerList()
                    //this.setData()
        }
        // Keep the template bindings identical for both uploaded data and saved finance details.
       
        this.isLoading = false;
      },
      () => { this.isLoading = false; this.financeData = {}; },
    );
  }
}
