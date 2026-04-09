import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { EditShowroomPriceComponent } from './edit-showroom-price/edit-showroom-price.component';
@Component({
  selector: 'app-view-new-finding-deal',
  templateUrl: './view-new-finding-deal.component.html',
  styleUrls: ['./view-new-finding-deal.component.scss'],
})
export class ViewNewFindingDealComponent  implements OnInit {
  @Input() listColorClass = 'sixColor';
  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private share: ShareService,
    private api: ApiService
  ) { }
  dismiss() {
    this.modalCtrl.dismiss();
  }
  enquiry: any

  ngOnInit() {
    this.getListEstimation()
    this.getValuation()

  //   this.getDetails()
  }

    listData: any;
  totalAmount = 0;
  getListEstimation() {
    let obj: any = this.share.getListObj('tractor_cost_estimation', false, [], true);
    obj.tractor_id = this.tractorDetails?.id;
    this.share.showLoading('Loading...');
    this.api.postapi('tractor_cost_estimation_byId', obj).subscribe(
      (res: any) => {
        this.listData = res.data;
     
     
        this.listData.reverse();
        this.totalAmount = 0;
        this.listData?.forEach((f: any) => {
          this.totalAmount =
            Number(this.totalAmount) + Number(f?.cost_value);
        });
        this.share.spinner.dismiss();
      },
      (error: any) => {}
    );
  }
  toNumber(value: any): number {
  return Number(value);
}
 valuationList: any = [];
  getValuation() {
    let obj = this.share.getListObj('getValuation', false, [], false);
    this.api.postapi('getValuation', obj).subscribe(
      (res: any) => {
        this.valuationList = res?.data;
           this.resetPrice()
        console.log('valuationList', this.valuationList);
      },
      (error: any) => {}
    );
  }
 async editShowRoomPrice(){
    
        const modal = await this.modalCtrl.create({
          component: EditShowroomPriceComponent,
          breakpoints: [0, 0.4, 1],
          initialBreakpoint: 0.4,
          cssClass: 'custom-modal',
          componentProps: {
            currentPrice: this.currentPrice,
        
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (data) {
       this.currentPrice=data?.currentPrice
       this.getPriceEstimate()
        }
  }

  currentPrice:any=0
    resetPrice(){

    let getModel=this.valuationList.find((f:any)=>f.model_id==this.tractorDetails?.modelDetails?.id)
    if(getModel){
   this.currentPrice=getModel?.model_current_price||0
    }else{
     // this.form.controls['current_price'].setValue(0)
    }
    this.getPriceEstimate()
  }

  getPriceEstimate() {

  if(this.currentPrice){
    this.share.showLoading("Checking")
    
    let date = new Date();
    let currentYear = date.getFullYear();
    let previousYear=currentYear-1
    let yearForPrice=this.tractorDetails?.yearOfManufactoring
    let currentPrice=this.currentPrice
    let lastYearPrice=Number(currentPrice)*0.8
    let deduction=0.95
    for (let index = previousYear-1; index >= yearForPrice; index--) {
    
      lastYearPrice=lastYearPrice*deduction
      lastYearPrice=Number(lastYearPrice.toFixed(0))
     console.log("index",index,lastYearPrice,deduction);
     deduction= Number((Number(deduction)-0.05).toFixed(2))
    }
    let getTyreCondition=this.tractorDetails?.tyreCondition
    if(getTyreCondition=='Poor'){
      lastYearPrice=Number(lastYearPrice)-50000
    }
    else if(getTyreCondition=='Average'){
      lastYearPrice=Number(lastYearPrice)-25000
    }
    else if(getTyreCondition=='Good'){
      lastYearPrice=Number(lastYearPrice)-12500
    }
    let getBodyCondition=this.tractorDetails?.bodyCondition
    if(getBodyCondition=='Poor'){
      lastYearPrice=Number(lastYearPrice)-50000
    }
    else if(getBodyCondition=='Average'){
      lastYearPrice=Number(lastYearPrice)-25000
    }
    else if(getBodyCondition=='Good'){
      lastYearPrice=Number(lastYearPrice)-12500
    }

this.predictionCost=lastYearPrice
this.leastPrediction=this.predictionCost-20000
this.maxPredictionCost=this.predictionCost+20000
this.leastSellingPrdiction=this.leastPrediction+60000
this.maxSellingPrdiction=this.maxPredictionCost+60000

setTimeout(() => {
  this.share.spinner.dismiss()
}, 300);
  }else{
this.share.presentToast("No Showroom Price Found")
  }
   
  }
  
  predictionCost:any
  leastPrediction:any=0
  leastSellingPrdiction=0
  maxSellingPrdiction=0
  maxPredictionCost:any=0
  tractorDetails:any
  details:any
  getDetails() {

    let obj: any = this.share.getListObj('model', true, ['logo'], false);
    this.share.showLoading('Checking Availaibility');
    obj.tractor_id = this.tractorDetails?.id
    this.api.postapi('getNewFindingAllDetails', obj).subscribe(
      (res: any) => {
        this.details = res?.data



        this.share?.spinner?.dismiss();
      },
      (error: any) => { }
    );
  }


}
