import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup ,FormControl,Validators} from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { CrudPopupComponent } from 'src/app/shared-components/crud-popup/crud-popup.component';
import { ModalController, ToastController } from '@ionic/angular';
import { SelectWithSearchComponent } from 'src/app/shared-components/select-with-search/select-with-search.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-edit-purchase-history',
  templateUrl: './edit-purchase-history.component.html',
  styleUrls: ['./edit-purchase-history.component.scss'],
})
export class EditPurchaseHistoryComponent  implements OnInit {
tractor:any=[]
  constructor(
    private share: ShareService,
    private api: ApiService,
    private modalCtrl: ModalController,
    private formBuilder:FormBuilder,
    private commonS:CommonMethodService,
   
  ) {}
  callSeperateApi:any='YES'
  ngOnInit() {
    this.tractor=this.obj?.tractor
    this.dealer_list=this.obj?.dealer_list
    this.callSeperateApi=this.obj?.callSeperateApi||'YES'
    if(!this.dealer_list?.length){
      this.getDealerList()
    }
     if(this.callSeperateApi=='YES'){

//this.getPurchaseHistoryListByTractorId()
     }
     else{
    this.setDealerName()

    this.initialize(this.tractor)
     }

  }
  getPurchaseHistoryListByTractorId(){
  
      this.share.showLoading('Refreshing Data...');

    let obj:any = this.share.getListObj('getPurchaseHistoryListByTractorId', false, [], true);
     obj.tractor_id=this.tractor?.id
    this.api.postapi('getPurchaseHistoryListByTractorId', obj).subscribe(
      (res: any) => {
        this.tractor = res.data;
   this.setDealerName()

    this.initialize(this.tractor)
        this.share.spinner.dismiss();
       
     
      },
      (error: any) => { }
    );
  }
  dealer_list:any=[]
  obj:any
  form:FormGroup
 initialize(data:any=null) {
    this.form = this.formBuilder.group({
      dealer_id: new FormControl(data?.dealer_id, [Validators.required]),
      contact1: new FormControl(data?.contact1, []),
      nameOfSeller: new FormControl(data?.nameOfSeller, []),
      address: new FormControl(data?.address, []),
    });
    console.log('this.dateForm', this.form.value);
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

    getDealerList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('dealer_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.dealer_list = res.data;

        this.share.spinner.dismiss();
        if(!loader){
if(this.callSeperateApi=='YES'){

this.getPurchaseHistoryListByTractorId()
     }
        }
     
      },
      (error: any) => { }
    );
  }
    dismiss() {
    return this.modalCtrl.dismiss(null, 'Cancel');
  }
    async selectItem(list: any, itemName: any, table_name: any) {
    const modal = await this.modalCtrl.create({
      component: SelectWithSearchComponent,
      componentProps: {
        list: list,
        itemName: itemName,
        table_name: table_name,
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
   
      this.form.controls['dealer_id'].setValue(data?.id);

      this.dealerName = data?.name;
      //this.resetOtherValue()
    }

    console.log('role', role, data);

    if (role === 'confirm') {
    }
  }
  updateItem() {

    if (this.form.valid) {
      let obj = {
        src: 'purchasedetail',
        data: this.form.value,
        id: this.tractor?.purchasedetail,
      };
      this.share.showLoading('Updating...');
      this.api.postapi('updateOpp', obj).subscribe((res: any) => {
        this.share.spinner.dismiss();
        this.form.reset();
        this.commonS.reloadMethod=true
        return this.modalCtrl.dismiss(true);
        // this.getList()
      });
    } else {
      this.share.presentToast('Please Select Dealer');
      this.form.markAllAsTouched();
    }
  }

 @Input() listColorClass = 'sevenColor';
  dealerName:any
   
    setDealerName() {


    let dealerDetail = this.dealer_list.find(
      (f: any) => f.id == this.tractor?.dealer_id,
    );
    if (dealerDetail) {
      this.dealerName = dealerDetail?.name;
    }
  }
}
