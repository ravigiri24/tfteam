import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RtoOptionsComponent } from './rto-management/rto-options/rto-options.component';
import { NocUpdateComponent } from './rto-management/rto-noc/noc-update/noc-update.component';
import { RtoDetailsFormComponent } from './rto-management/rto-details-form/rto-details-form.component';
import { DocsOptionsComponent } from './rto-management/rto-sold-process/docs-options/docs-options.component';
import { RtoDocsDetailsComponent } from './rto-management/rto-docs-details/rto-docs-details.component';
@Injectable({
  providedIn: 'root'
})
export class CommonMethodService {

  constructor(private modalCtrl:ModalController) { }

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
       this.reloadMethod=true
        }
      }
      reloadMethod=false
    async  actionEventCall(e: any) {
    console.log('actionEventCall', e);
    this.reloadMethod=false
    if (e?.button?.name == 'IS Noc') {
     await this.nocUpdate(e?.tractor)
    }
    if (e?.button?.name == 'View Details') {
      this.viewDetails(e?.tractor);
    }
        console.log('actionEventCall', e);
     if (e?.button?.name == 'Add RTO Details') {
       this.addRTODetails(e?.tractor);
     }
     if (e?.button?.name == 'View Details RTO') {
       this.viewDetailsRtoSales(e?.tractor);
     }
          if (e?.button?.name == 'Download Docs') {
       this.downLoadDocs(e?.tractor);
     }
     
    
  }
    async addRTODetails(tractor: any) {
      const modal = await this.modalCtrl.create({
        component: RtoDetailsFormComponent,
        componentProps: {
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
        if (data) {
       this.reloadMethod=true
        }
    }
       async viewDetailsRtoSales(tractor: any) {
        
         const modal = await this.modalCtrl.create({
           component: DocsOptionsComponent,
        
           cssClass: 'custom-modal',
           componentProps: {
             tractor: tractor,
            
           },
         });
         await modal.present();
         const { data, role } = await modal.onWillDismiss();
         if (data) {
          this.reloadMethod=true
         }
       }
        async downLoadDocs(tractor:any){
          const modal = await this.modalCtrl.create({
              component: RtoDocsDetailsComponent,
           
              cssClass: 'custom-modal',
              componentProps: {
                tractor: tractor,
               
              },
            });
            await modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (data) {
           //   this.callListApi();
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
}
