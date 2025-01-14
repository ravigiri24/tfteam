import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from '../share.service';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { CrudPopupComponent } from '../shared-components/crud-popup/crud-popup.component';

@Component({
  selector: 'app-tractor-finance-details',
  templateUrl: './tractor-finance-details.component.html',
  styleUrls: ['./tractor-finance-details.component.scss'],
})
export class TractorFinanceDetailsComponent  implements OnInit {
  tractorDetails:any
  constructor(private modalControl:ModalController,private share:ShareService,private api:ApiService,private formBuilder:FormBuilder) { }
  dismiss() {
    this.modalControl.dismiss();
  }
  ngOnInit() {}
  financeForm:FormGroup
  async openCrudManagement(type: any = 'BANK_DETAILS') {
    const modal = await this.modalControl.create({
      component: CrudPopupComponent,
      componentProps: {
        type: type,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (type == 'BANK_DETAILS') {
      this.getfinancerList();
    }
    console.log('role', role);
  }
  financerList: any = [];
  getfinancerList(loader: any = false) {
    if(loader){
      this.share.showLoading("Refreshing Data...")
    }
    let obj = this.share.getListObj('warehouselocation', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res:any) => {
        this.financerList = res?.data;
        if(loader){
          this.share.spinner.dismiss()
        }
      },
      (error:any) => {
       
      }
    );
  }
}
