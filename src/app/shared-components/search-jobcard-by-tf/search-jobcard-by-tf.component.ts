import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SyncTractorWithMaintaninanceComponent } from '../sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { CommonMethodService } from 'src/app/common-method.service';
@Component({
  selector: 'app-search-jobcard-by-tf',
  templateUrl: './search-jobcard-by-tf.component.html',
  styleUrls: ['./search-jobcard-by-tf.component.scss'],
})
export class SearchJobcardByTfComponent  implements OnInit {
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private router: Router,
    private commonMethod: CommonMethodService
  ) { }
  listColorClass = 'sevenColor'
  buttonArray: any = [];
  keyList: any = [];

  registractionNo = 'registractionNo';
  ngOnInit() { }
  tractorList: any = [];
  staffDetails: any;
  isTractorFound: any;
  obj: any
  async actionEvent(e: any) {
    if (e?.button?.closeCurrentPopUP) {
      this.modalControl.dismiss();
    }
    await this.commonMethod.actionEventCall(e, this.obj);
    if (this.commonMethod.reloadMethod) {
      this.searchTractor();
    }
    // this.actionEventCall.emit({tractor,button})
  }
  refreshList() {
    this.searchTractor();
  }
  searchKey: any;
  searchTractor() {    
    if (this.search?.tfCode) {
      this.share.showLoading('Searching');
      let staffDetails: any = this.share.get_staff();
      this.staffDetails = JSON.parse(staffDetails);

      let obj = {
        operate: this.staffDetails?.staffCode,

        tfCode: this.search.tfCode,
      };
      this.tractorList = []
      this.api.postapi('searchJobByTfCode', obj).subscribe(
        (res: any) => {
          if (res?.data?.length) {
            this.isTractorFound = true;
            this.tractorList = res?.data;
                   this.tractorList?.forEach((job:any)=>{
job.modalName=job?.modelDetails?.name
       })

          } else {
            this.isTractorFound = false;
            this.share.presentToast('Not found any tractor');
            this.tractorList = [];
          }

          this.share.spinner.dismiss();
        },
        (error: any) => {
          this.isTractorFound = false;
          this.share.spinner.dismiss();
        }
      );
    } else {
      this.share.presentToast('Please Enter TFCode');
    }
  }
  searchFilter: any;
  search: any = {
    tfCode: null,
  };
  dismiss() {
    // this.dismissPopup.emit()
    this.modalControl.dismiss();
  }
  tractorDashboard(tractor: any) {
    this.modalControl.dismiss();
    this.router.navigate([
      '/operational/view-dashboard',
      tractor?.id,
      '/operational/all-tractor-management',
    ]);
  }


}
