import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { SyncTractorWithMaintaninanceComponent } from '../sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
@Component({
  selector: 'app-search-tractor-with-tf-code',
  templateUrl: './search-tractor-with-tf-code.component.html',
  styleUrls: ['./search-tractor-with-tf-code.component.scss'],
})
export class SearchTractorWithTfCodeComponent implements OnInit {
  constructor(
    private modalControl: ModalController,
    private share: ShareService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {}
  tractorList: any = [];
  staffDetails: any;
  isTractorFound: any;
  searchTractor() {
    this.share.showLoading('Searching');
    if (this.search?.tfCode) {
      let staffDetails: any = this.share.get_staff();
      this.staffDetails = JSON.parse(staffDetails);

      let obj = {
        operate: this.staffDetails?.staffCode,

        tfCode: this.search.tfCode,
      };

      this.api.postapi('searchTractorByTfCode', obj).subscribe(
        (res: any) => {
          if (res?.data?.length) {
            this.isTractorFound = true;
            this.tractorList = res?.data;
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
  search: any = {
    tfCode: null,
  };
  dismiss() {
    this.modalControl.dismiss();
  }
  tractorDashboard(tractor: any) {
    this.modalControl.dismiss()
    this.router.navigate([
      '/operational/view-dashboard',
      tractor?.id,
      '/operational/all-tractor-management',
    ]);
  }
  async syncManitainance(tractor: any) {
    const modal = await this.modalControl.create({
      component: SyncTractorWithMaintaninanceComponent,
      componentProps: {
        tractor: tractor,
      },
    });
    await modal.present();
  

    const { data, role } = await modal.onWillDismiss();
  }
}
