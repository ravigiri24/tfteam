import { Component, OnInit,Input, EventEmitter,Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from '../crud-popup/crud-popup.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent  implements OnInit {
@Input() typePurchaseList:any=[]
@Input() companyRepresentativeList:any=[]
@Input() cityList:any=[]
@Input() data:any
@Input() modelForm:FormGroup
@Output() saveFormEvent=new EventEmitter()
@Output() callListApi=new EventEmitter()
  constructor(private share:ShareService,private api:ApiService,private modalCtrl:ModalController) { }

  ngOnInit() {}
  saveForm(){
    this.saveFormEvent.emit()
  }
async openCrudManagement(type: any) {
      const modal = await this.modalCtrl.create({
        component: CrudPopupComponent,
        componentProps: {
          type: type,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
   
      this.refreshList(type)
      console.log('role', role);
    }
    refreshList(type:any){
      this.callListApi.emit(type)
    }
}
