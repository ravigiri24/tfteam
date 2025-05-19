import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChartType } from 'angular-google-charts';
import { DateFilterComponent } from './date-filter/date-filter.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent  implements OnInit {

  constructor(private modalCtrl:ModalController,private formBuilder:FormBuilder,private share:ShareService,private api:ApiService) { }
dismiss(){
this.modalCtrl.dismiss()
}
  ngOnInit() {
    this.initialize()
      this.sreenWidth=  screen.width
   console.log("this.sreenWidth",this.sreenWidth);
   
  }


sreenWidth:any=  screen.width

  chart = {
    title: 'Leads',
    type: ChartType.PieChart,
 data: [
  ['Digital', 0],
  ['Online', 0],
  ['Visitor', 0],

],
columns: ['Platform', 'Number'],
    options: { is3D: true,pieHole: 0.4,   pieSliceText: 'value',
     tooltip: {
    text: 'value' // Also show numbers in tooltips
  },
  pieSliceTextStyle: {
    color: 'black',
    fontSize: 16
  } },
    width:400,
    height: 250,

  };
chartDigital={
      title: 'Digital',
    type: ChartType.PieChart,
 data: [
  ['Instagram', 8],
  ['Youtube', 2],
  ['Facebook', 4],
  ['JustDial', 4],
  ['Other', 4],

],
columns: ['Platform', 'Number'],
    options: { is3D: true,pieHole: 0.4,   pieSliceText: 'value',
     tooltip: {
    text: 'value' // Also show numbers in tooltips
  },
  pieSliceTextStyle: {
    color: 'black',
    fontSize: 16
  } },
    width:400,
    height: 250,
}
 chartSales = {
    title: 'Sales Review',
    type: ChartType.PieChart,
 data: [
  ['Digital', 0],
  ['Online', 0],
  ['Visitor', 0],

],
columns: ['Platform', 'Number'],
    options: { is3D: true,pieHole: 0.4,   pieSliceText: 'value',
     tooltip: {
    text: 'value' // Also show numbers in tooltips
  },
  pieSliceTextStyle: {
    color: 'black',
    fontSize: 16
  } },
    width:400,
    height: 250,

  };
staffDetails:any
overViewData:any
isOverViewData=false
overviewData(){
     if (
        this.form.controls['startDate']?.value <=
        this.form.controls['endDate']?.value
      ) {
        this.isOverViewData=false
       this.share.showLoading("Searching")
     let staffDetails: any = this.share.get_staff();
      this.staffDetails = JSON.parse(staffDetails);
 let obj = {
        operate: this.staffDetails?.staffCode,
        startDate:  this.form.controls['startDate']?.value,
        endDate:  this.form.controls['endDate']?.value,
        storeId:this.staffDetails?.storeId
      };
  this.api.postapi('getCustomerOverview', obj).subscribe(
        (res: any) => {
          if (res?.status == true) {
          
      this.overViewData=res?.data
           this.chart.data[0][1]=res?.data?.digital
           this.chart.data[1][1]=res?.data?.online
           this.chart.data[2][1]=res?.data?.visitors

           //digital
           this.chartDigital.data[0][1]=res?.data?.instagrame
           this.chartDigital.data[1][1]=res?.data?.youtube
           this.chartDigital.data[2][1]=res?.data?.facebook
           this.chartDigital.data[3][1]=res?.data?.justDial
           this.chartDigital.data[4][1]=res?.data?.other

           //sales
            this.chartSales.data[0][1]=res?.data?.digitalSales
           this.chartSales.data[1][1]=res?.data?.onlineSales
           this.chartSales.data[2][1]=res?.data?.visitorSales
          
           setTimeout(() => {
                 this.isOverViewData=true
           }, 0);
          } else {
           
          }
  
          this.share.spinner.dismiss();
    },(error:any)=>{
    setTimeout(() => {
       this.share.presentToast('Error:Something Wrong');
         this.share.spinner.dismiss();
                     this.isOverViewData=true
           }, 0);
    })
  }else{
           this.share.presentToast('Error:End Date is less than Start Date');
    }

}

  form:FormGroup
    initialize() {
      let date=new Date()
      let day=date?.getDate()
      let month=(date?.getMonth()+1).toString()
      let year=date?.getFullYear()
      console.log("getMonth",month,date);
      
      if(month.toString()?.length==1){
    month= '0'+month
    console.log("month",month);
    
      }
      let dataFormated=year+'-'+month+'-'+day
      console.log("dataFormated",dataFormated);
      
      this.form = this.formBuilder.group({
        startDate: new FormControl(dataFormated, [Validators.required]),
        endDate: new FormControl(dataFormated, [Validators.required]),
   
      });
      this.overviewData()
      console.log('this.dateForm', this.form.value);
    }
async  visiting_dates(){
  const modal = await this.modalCtrl.create({
        component: DateFilterComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.6,
        cssClass: 'custom-modal',
        componentProps: {
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if ( data?.isAdd) {
   
      }
  }
}
