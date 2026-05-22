import { Component, OnInit, Input } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { CommonMethodService } from 'src/app/common-method.service';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { ShareService } from 'src/app/share.service';
@Component({
  selector: 'app-view-purchase-history',
  templateUrl: './view-purchase-history.component.html',
  styleUrls: ['./view-purchase-history.component.scss'],
})
export class ViewPurchaseHistoryComponent implements OnInit {
  constructor(
    private modalControl: ModalController,
    private formBuilder: FormBuilder,
    private commonMethod: CommonMethodService,
    public share: ShareService,
    private api: ApiService,
  ) {}
  @Input() listColorClass = 'secondColor';
  ngOnInit() {
    this.initialize();
    this.getDealerList();
  }
  dismiss() {
    this.modalControl.dismiss();
  }
  form: FormGroup;
  initialize() {
    this.form = this.formBuilder.group({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
    });
  }
  search = {
    registractionNo: null,
  };
  tractorList: any = [];
  getTractors() {
    if (this.form.valid) {
      if (
        this.form.controls['startDate']?.value <=
        this.form.controls['endDate']?.value
      ) {
        let obj: any = this.share.getListObj(
          'getTractorSheetByDate',
          false,
          [],
          true,
        );

        obj.startDate = this.form.controls['startDate'].value;
        obj.endDate = this.form.controls['endDate'].value;

        this.share.showLoading('Fetching Report...');

        this.api
          .postapi('getPurchaseHistorySheetByDate', obj)
          .subscribe((res: any) => {
            this.tractorList = res?.data;
            this.tractorList?.forEach((f: any) => {
              let newObj = JSON.parse(JSON.stringify(f));
              if (f?.dealerName != 'Other') {
                f.nameOfSellerShow = null;
                f.contact1Show = null;
                f.addressShow = null;
              } else {
                f.nameOfSellerShow = newObj.nameOfSeller;
                f.contact1Show = newObj.contact1;
                f.addressShow = newObj.address;
              }
            });
            //this.tractorList.spareList= this.tractorList.spareList.reverse()
            this.share.spinner.dismiss();
          });
      } else {
        this.share.presentToast('Error:End Date is less than Start Date');
      }
    } else {
      this.share.presentToast('Error:Please Fill Required(*) Fields');
    }
  }
  async searchTractor() {
    const modal = await this.modalControl.create({
      component: SearchTractorWithTfCodeComponent,
      componentProps: {
        buttonArray: this.buttonArray,
        listColorClass: this.listColorClass,
        keyList: [
          { key: 'Model', value: 'name', type: 'INPUT' },
          { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },

          { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
        ],
        searchFilter: this.search,
        searchKey: 'registractionNo',
        obj: { optionsUploadButtonArray: [] },
      },
      cssClass: 'midium-model',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }

  buttonArray: any = [
    {
      name: 'Tractor Purchase History',
      action: 'tractorPurchaseHistory',
      image: './././assets/images/contract.png',
    },
  ];
  dealer_list: any = [];
  getDealerList(loader: any = false) {
    if (loader) {
      this.share.showLoading('Refreshing Data...');
    }
    let obj = this.share.getListObj('dealer_list', false, [], true);
    this.api.postapi('getList', obj).subscribe(
      (res: any) => {
        this.dealer_list = res.data;

        this.share.spinner.dismiss();
        if (!loader) {
        }
      },
      (error: any) => {},
    );
  }
  async actionEventCall(e: any) {
    e.dealer_list = this.dealer_list;
    e.callSeperateApi = 'NO';
    await this.commonMethod.actionEventCall(e, {
      optionsUploadButtonArray: [],
    });

    if (this.commonMethod.reloadMethod) {
      this.getTractors();
      this.getDealerList()
    }
    //   if(e?.button?.name == 'Tractor Dashboard') {
    //     this.tractorDashboard(e?.tractor);
    //   }
    //   else if(e?.button?.name == 'Sync Mainatainance') {
    //     this.syncManitainance(e?.tractor);
    //   }
    //    else if(e?.button?.name == 'Tractor Summary') {
    //     this.tractorViewDetail(e?.tractor);
    //   }
    // else if(e?.button?.name == 'Delete Tractor') {
    //     this.deleteTractor(e?.tractor);
    //   }

    if (this.commonMethod.reloadMethod) {
      this.getTractors();
    }
    console.log('actionEventCall', e);
  }
  keyList: any = [
    { key: 'Model', value: 'name', type: 'INPUT' },
    { key: 'TF Code', value: 'registractionNo', type: 'INPUT' },
    { key: 'Dealer Name', value: 'dealerName', type: 'INPUT' },
    { key: 'Seller Name', value: 'nameOfSellerShow', type: 'INPUT' },
    { key: 'Address', value: 'addressShow', type: 'INPUT' },
    { key: 'Contact', value: 'contact1Show', type: 'INPUT' },

    // { key: 'Transported Place', getFromObj: true, objName: 'transportDestination', value: 'name', type: 'INPUT' },
    // { key: 'Franchise(Alloted)', getFromObj: true, objName: 'franchiseDettails', value: 'name', type: 'INPUT' },
    { key: 'Registered Date', value: 'createdOn', type: 'DATE' },
  ];
}
