import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NocUpdateComponent } from '../noc-update/noc-update.component';
import { RtoOptionsComponent } from '../../rto-options/rto-options.component';
@Component({
  selector: 'app-search-rto-noc',
  templateUrl: './search-rto-noc.component.html',
  styleUrls: ['./search-rto-noc.component.scss'],
})
export class SearchRtoNocComponent  implements OnInit {

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}
dismiss(){
  this.modalCtrl.dismiss()
}
  buttonArray: any = [
    {
      name: 'IS Noc',
      action: 'nocUpdate',
      image: './././assets/images/stamp.png',
    },
      {
      name: 'View Details',
      action: 'viewDetails',
      image: './././assets/images/visual.png',
    },
  ];

  actionEventCall(e: any) {
    console.log('actionEventCall', e);
    if (e?.button?.name == 'IS Noc') {
      this.nocUpdate(e?.tractor);
    }
    if (e?.button?.name == 'View Details') {
      this.viewDetails(e?.tractor);
    }
    
  }
     async viewDetails(tractor: any) {
     
      const modal = await this.modalCtrl.create({
        component: RtoOptionsComponent,
     
        cssClass: 'custom-modal',
        componentProps: {
          tractor: tractor,
         
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
        //this.callListApi();
      }
    }
   async nocUpdate(tractor: any) {
      let isNoc;
      if (tractor?.isNoc == null) {
        isNoc = null;
      } else if (tractor?.isNoc == 1) {
        isNoc = true;
      } else if (tractor?.isNoc == 0) {
        isNoc = false;
      }
      const modal = await this.modalCtrl.create({
        component: NocUpdateComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.4,
        cssClass: 'custom-modal',
        componentProps: {
          tractor: tractor,
          isNoc:isNoc
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
      
      }
    }
}
