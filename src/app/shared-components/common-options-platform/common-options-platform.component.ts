import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
import { ShareService } from 'src/app/share.service';
import { ShowSalesDetailsComponent } from 'src/app/finance-department/show-sales-details/show-sales-details.component';
import { FinanceDetailsComponent } from 'src/app/rto-management/rto-docs-details/finance-details/finance-details.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-common-options-platform',
  templateUrl: './common-options-platform.component.html',
  styleUrls: ['./common-options-platform.component.scss'],
})
export class CommonOptionsPlatformComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private commonService: CommonMethodService
  ) {}
  tractor: any;
  ngOnInit() {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
  async seeSellDetails() {
    const modal = await this.modalCtrl.create({
      component: ShowSalesDetailsComponent,
      componentProps: {
        tractor: this.tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);
  }
  optionsArray: any = [];
  async actionEvent(option: any) {
    if (option?.type == 'IMAGE') {
      this.goToUplodeSectionDynamic(option);
    } else if (option?.type == 'FUNCTION_CALL') {
    await  this.commonService.functionCall({
        funcName: option?.funcName,
        tractor: this.tractor,
        closePopUp: option?.closePopUp,
      });
      setTimeout(() => {
        if(option?.closePopUp){
       
          this.commonService.reloadMethod=true
        }
      }, 0);
    }
  }
  async goToUplodeSectionDynamic(option: any) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: {
        tarctor_id: this.tractor?.id,
        imageGroup: option?.param,
        showDeleteButton: option?.showDeleteButton,
        showHeading: option?.showHeading,
        uploadPhoto: option?.uploadPhoto,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
}
