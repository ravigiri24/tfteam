import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-sell-back',
  templateUrl: './sell-back.component.html',
  styleUrls: ['./sell-back.component.scss'],
})
export class SellBackComponent  implements OnInit {
  showFilter = true;
  constructor(
    private modalcontrol: ModalController,
    private share: ShareService,
    private api: ApiService
  ) {}
  reason: any;
  ngOnInit() {}
  tractor: any;

  sellBackHistory() {
    //  this.modalcontrol.dismiss(true);
    
      let objData: any = {
        reason: this.reason,
        backFrom:'FRANCHISE',
    
        franchiseId:this.tractor?.tractordetailadmin?.wareHouseLocation ,
        tractor_id:this.tractor?.id,
        soldDate:this.tractor?.dateOfDealerSale,
        price:this.tractor?.dealerPrice,
        isSoldByDealer:false

      };
      let obj = {
        src: 'salebackhistory',
        data: objData,
  
      };

   
      this.api.postapi('addOpp', obj).subscribe((res: any) => {

  this.share.spinner.dismiss();

        this.share.presentToast('Done Successfully');
              
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    
  }
  
    deleteSalesDetails() {
    let objData: any = {
      isDeleted: 1,

    };
    let obj = {
      src: 'tractorsellingdetails',
      data: objData,
      id: this.tractor?.sellingDetailedId,
    };

    this.api.postapi('updateOpp', obj).subscribe((res: any) => {

      this.removeSellId()


      //  this.dismiss();
    });
  }
  removeSellId() {
    let objData: any = {
      isSold: 0,
      sellingDetailedId: null
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractor?.id,
    };


    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.tractor.isSold = 0
      this.tractor.sellingDetailedId = null
  
this.sellBackHistoryCustomer()


      //  this.dismiss();
    });
  }
    backSale() {
    if (this.reason != null && this.reason != undefined) {
      
      let dataTractor: any = {
        dealerPrice: null,
        isSoldToDealer: false,
        dateOfDealerSale: null,
      };
      let obj = {
        src: 'tractor',
        data: dataTractor,
        id: this.tractor?.id,
      };
      this.share.showLoading('Updating Details...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
           this.removeWarehouseAllotement()
          this.sellBackHistory();
       
  if(this.tractor.isSold==1 && this.tractor.sellingDetailedId){
    this.deleteSalesDetails()
  }
      
    
      });
    } else {
           this.share.presentToast('Please Enter Reason');


    }
  }
    removeWarehouseAllotement() {
  
      let dataWarehouse: any = {
        wareHouseLocation: 1,
      };
      let obj = {
        src: 'tractordetailadmin',
        data: dataWarehouse,
        id: this.tractor?.tractordetailadmin?.id,
      };

      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
    
      
      });
  
  }
    sellBackHistoryCustomer() {
    //  this.modalcontrol.dismiss(true);
    
      let objData: any = {
        reason: this.reason,
        backFrom:'CUSTOMER',
        franchiseId:null,
        tractor_id:this.tractor?.id,
        soldDate:null,
        price:null,
        isSoldByDealer:true,
        soldDetails_id:this.tractor?.sellingDetailedId,
          };
      let obj = {
        src: 'salebackhistory',
        data: objData,
    
      };

   
      this.api.postapi('addOpp', obj).subscribe((res: any) => {

  this.share.spinner.dismiss();

        this.share.presentToast('Done Successfully');
              
        this.modalcontrol.dismiss(true);

        //  this.dismiss();
      });
    
  }
}
