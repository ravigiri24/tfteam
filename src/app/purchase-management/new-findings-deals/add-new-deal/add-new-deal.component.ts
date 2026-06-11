import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Output,
  Input,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { initialize, OverlayEventDetail } from '@ionic/core/components';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
@Component({
  selector: 'app-add-new-deal',
  templateUrl: './add-new-deal.component.html',
  styleUrls: ['./add-new-deal.component.scss'],
})
export class AddNewDealComponent  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private share: ShareService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private modalCntrol: ModalController,
    private modalCtrl:ModalController,
    
  ) {}

  ngOnInit() {
    this.initialize();

    this.getDealerList()
   
  }


    dealerList: any = [];

  getDealerList(loader:any=false) {
    this.dealerList = [];
    let obj = this.share.getListObj('dealer_list', false, [], false);
    if(loader){
this.share.showLoading('Loading...')
    }
    // this.share.showLoading('Loading...')
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.dealerList = res.data;
         if(loader){
        this.share?.spinner?.dismiss();
         }
         this.setDealerName()
      },
      (error: any) => {}
    );
  }
  setDealerName() {


    let dealerDetail = this.dealerList.find(
      (f: any) => f.id == this.data?.dealerId,
    );
    if (dealerDetail) {
      this.dealerName = dealerDetail?.name;
    }
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
  
      this.getDealerList(true)
      console.log('role', role);
    }
       async selectItem(list: any, itemName: any, table_name: any) {
        const modal = await this.modalCtrl.create({
          component: SelectWithSearchComponent,
          componentProps: {
            list: list,
            itemName: itemName,
            table_name: table_name,
            showAddButton:false,
            otherObjects: null,
            jsonKey: 'name',
            search: {
              name: null,
            },
          },
        });
        await modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
        if (data) {
       
          this.newFindingForms.controls['dealerId'].setValue(data?.id);
    
          this.dealerName = data?.name;
          //this.resetOtherValue()
        }
    
        console.log('role', role, data);
    
        if (role === 'confirm') {
        }
      }
      dealerName:any

  dismiss() {
    this.modalCntrol.dismiss();
  }
  saveForm() {
 
    if (this.newFindingForms.valid) {
      
      let obj:any = {
        src: 'new_finding_deals',
        data: this.newFindingForms.value,
      };
   
      this.share.showLoading('Saving');
      this.api.postapi('addOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Saved Successfully');
        this.share.spinner.dismiss();
        this.newFindingForms.reset();
        return this.modalCntrol.dismiss(null, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.share.presentToast('Please Fill required fields');
      this.newFindingForms.markAllAsTouched();
    }
  }
  updateForm() {
    if (this.newFindingForms.valid) {
      let obj = {
        src: 'new_finding_deals',
        data: this.newFindingForms.value,
        id:this.data?.id
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.presentToast('Updated Successfully');
        this.share.spinner.dismiss();
        this.newFindingForms.reset();
        return this.modalCntrol.dismiss(true, 'confirm');

        //this.view='LIST'
      });
    } else {
      this.share.presentToast('Please Fill required fields');
      this.newFindingForms.markAllAsTouched();
    }
  }
  newFindingForms: FormGroup;

  staffDetails: any;
  data: any;
  initialize() {
    let staffDetails: any = this.share.get_staff();
    console.log('staffDetails', staffDetails);
    this.staffDetails = JSON.parse(staffDetails);

    this.newFindingForms = this.fb.group({
       dealerId: new FormControl(this.data?.dealerId, [Validators.required]),
      actionByid: new FormControl(this.staffDetails?.id, [Validators.required]),
    
      deal_date: new FormControl(this.data?.deal_date, [Validators.required]),
   
    });
  }

}
