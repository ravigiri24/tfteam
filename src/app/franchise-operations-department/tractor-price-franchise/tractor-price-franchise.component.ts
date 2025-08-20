import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-tractor-price-franchise',
  templateUrl: './tractor-price-franchise.component.html',
  styleUrls: ['./tractor-price-franchise.component.scss'],
})
export class TractorPriceFranchiseComponent  implements OnInit {


  showFilter = true;
  price:any
  constructor(private modalcontrol: ModalController,private share:ShareService,private api:ApiService) {}
isNoc:any=true
  ngOnInit() {
  this.price=Number(this.tractor?.price)
    
  }
  tractor:any
  
    updatePrice() {
      if(this.price!=null && this.price!=undefined){
    let objData: any = {
      price: this.price
    };
    let obj = {
      src: 'tractor',
      data: objData,
      id: this.tractor?.id,
    };

    this.share.showLoading('Updating Data...');
    this.api.postapi('updateOpp', obj).subscribe((res: any) => {
      this.share.spinner.dismiss();
  
      this.share.presentToast('Updated Successfully...');
      this.modalcontrol.dismiss(true)
     
      //  this.dismiss();
    });
  }
    else{
  this.share.presentToast('Please Select');
    }
  }
 
}
