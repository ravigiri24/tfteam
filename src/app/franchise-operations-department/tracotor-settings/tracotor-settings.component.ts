import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddDealerPriceComponent } from 'src/app/purchase-management/add-dealer-price/add-dealer-price.component';
@Component({
  selector: 'app-tracotor-settings',
  templateUrl: './tracotor-settings.component.html',
  styleUrls: ['./tracotor-settings.component.scss'],
})
export class TracotorSettingsComponent  implements OnInit {

  constructor(private modalCtrl:ModalController) { }
tractorDetails:any
  ngOnInit() {}
 async openDealerPrice() {
        const modal = await this.modalCtrl.create({
          component: AddDealerPriceComponent,
          breakpoints: [0, 0.4, 1],
          initialBreakpoint: 0.5,
          cssClass: 'custom-modal',
          componentProps: {
     tractorDetails:this.tractorDetails
      
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (data && data?.isFilterChange) {
          console.log('data', data);
          // this.filterBy = data?.filterBy;
          // this.sortByFilter()
        }
    
      }
}
