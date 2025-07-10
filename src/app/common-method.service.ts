import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { RtoOptionsComponent } from './rto-management/rto-options/rto-options.component';
import { NocUpdateComponent } from './rto-management/rto-noc/noc-update/noc-update.component';
import { RtoDetailsFormComponent } from './rto-management/rto-details-form/rto-details-form.component';
import { DocsOptionsComponent } from './rto-management/rto-sold-process/docs-options/docs-options.component';
import { RtoDocsDetailsComponent } from './rto-management/rto-docs-details/rto-docs-details.component';
import { Router } from '@angular/router';
import { CommonOptionsPlatformComponent } from './shared-components/common-options-platform/common-options-platform.component';
import { FinanceDetailsComponent } from './rto-management/rto-docs-details/finance-details/finance-details.component';
import { ShowSalesDetailsComponent } from './finance-department/show-sales-details/show-sales-details.component';
import { TractorSellsDetailsComponent } from './tractor-sells-details/tractor-sells-details.component';
import { RcUpdateComponent } from './shared-components/rc-update/rc-update.component';
@Injectable({
  providedIn: 'root'
})
export class CommonMethodService {

  constructor(private modalCtrl:ModalController,private router:Router,private toastController:ToastController) { }

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
    async  actionEventCall(e: any,obj:any=null) {
    console.log('actionEventCall', e);
    this.reloadMethod=false
    if (e?.button?.name == 'IS Noc') {
     await this.nocUpdate(e?.tractor)
    }
  else  if (e?.button?.name == 'View Details') {
    await  this.viewDetails(e?.tractor,obj);
    }
     
   else if (e?.button?.name == 'Add RTO Details') {
    await   this.addRTODetails(e?.tractor);
     }
    else if (e?.button?.name == 'View Details RTO') {
    await   this.viewDetailsRtoSales(e?.tractor,obj);
     }
       else   if (e?.button?.name == 'Download Docs') {
      await this.downLoadDocs(e?.tractor,obj);
     }
     else if(e?.button?.name == 'RTO Expense'){
     this.addRTOExpense(e?.tractor)
    }
    else   if (e?.button?.name == 'Sell Details') {
    await  this.addSellDetails(e?.tractor);
    } else if (e?.button?.name == 'Sale Options') {
      obj.buttonArray=obj?.optionsUploadButtonArray
     await this.commonOptionsPlatform(e?.tractor,obj);
    }
    
    
  }
 async functionCall(obj:any){
      this.reloadMethod=false
    if (obj?.funcName == 'seeFinanceDetails') {
     await this.seeFinanceDetails(obj)
    }
     else if(obj?.funcName == 'rcUpdate'){
        await this.rcUpdate(obj);
     }
     if (obj?.funcName == 'seeSellDetails') {
     await this.seeSellDetails(obj)
    }
  }
   async seeSellDetails(obj:any) {
      const modal = await this.modalCtrl.create({
        component: ShowSalesDetailsComponent,
        componentProps: {
          tractor: obj?.tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
    }
     async rcUpdate(obj:any) {
      if(obj?.tractor?.rtoDetailsIdDetails){
          let isrtoDone;
        if (obj?.tractor?.rtoDetailsIdDetails?.isrtoDone == null) {
          isrtoDone = null;
        } else if (obj?.tractor?.rtoDetailsIdDetails?.isrtoDone == 1) {
          isrtoDone = true;
        } else if (obj?.tractor?.rtoDetailsIdDetails?.isrtoDone == 0) {
          isrtoDone = false;
        }
      const modal = await this.modalCtrl.create({
        breakpoints: [0, 0.4, 1],
          initialBreakpoint: 0.4,
          cssClass: 'custom-modal',
        component: RcUpdateComponent,
        componentProps: {
          tractor: obj?.tractor,
          isrtoDone:isrtoDone
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
          if (data) {
       this.reloadMethod=true
        }
      }else{
       this.presentToast("Please Fill RTO Details First")
   
      }
    
    }
      async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

    async seeFinanceDetails(obj:any) {
      const modal = await this.modalCtrl.create({
        component: FinanceDetailsComponent,
        componentProps: {
          tractor: obj.tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
    }
    async addRTOExpense(tractor:any){
    this.router.navigate(['/rto-department/add-rto-cost', tractor?.id]);
  
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
       async viewDetailsRtoSales(tractor: any,obj:any) {
        
         const modal = await this.modalCtrl.create({
           component: CommonOptionsPlatformComponent,
        
           cssClass: 'custom-modal',
           componentProps: {
             tractor: tractor,
                 optionsArray:obj?.optionsUploadButtonArray
           },
         });
         await modal.present();
         const { data, role } = await modal.onWillDismiss();
         if (data) {
          this.reloadMethod=true
         }
       }
        async downLoadDocs(tractor:any,obj:any){
          const modal = await this.modalCtrl.create({
              component: CommonOptionsPlatformComponent,
           
              cssClass: 'custom-modal',
              componentProps: {
                tractor: tractor,
                optionsArray:obj?.optionsArray
               
              },
            });
            await modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (data) {
           //   this.callListApi();
            }
          }
     async viewDetails(tractor: any,obj:any) {
       
        const modal = await this.modalCtrl.create({
          component: CommonOptionsPlatformComponent,
       
          cssClass: 'custom-modal',
          componentProps: {
            tractor: tractor,
        optionsArray:obj?.optionsUploadButtonArray
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (data) {
          this.modalCtrl.dismiss(true)
          //this.callListApi();
        }
      }
        async addSellDetails(tractor: any) {
          const modal = await this.modalCtrl.create({
            component: TractorSellsDetailsComponent,
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
          //if (role === 'confirm') {
         
          //}
        }
     
          async commonOptionsPlatform(tractor: any,obj:any) {
        
         const modal = await this.modalCtrl.create({
           component: CommonOptionsPlatformComponent,
        
           cssClass: 'custom-modal',
           componentProps: {
             tractor: tractor,
            optionsArray:obj?.buttonArray
           },
         });
         await modal.present();
         const { data, role } = await modal.onWillDismiss();
         if (data) {
          this.reloadMethod=true
         }
       }
}
