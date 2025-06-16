import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ShareService } from '../../share.service';
import { ImageViewerComponent } from '../../maintainance-management/image-viewer/image-viewer.component';
import { AlertController, ModalController } from '@ionic/angular';
import { ImageDashboardComponent } from '../../maintainance-management/image-dashboard/image-dashboard.component';
import { RepairTractorDashboardComponent } from '../../maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { Router } from '@angular/router';
import { SingleImageShowComponent } from 'src/app/maintainance-management/single-image-show/single-image-show.component';
import { SearchTractorWithTfCodeComponent } from 'src/app/shared-components/search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { EnterTfCodeComponent } from '../enter-tf-code/enter-tf-code.component';
@Component({
  selector: 'app-genrate-tf-code',
  templateUrl: './genrate-tf-code.component.html',
  styleUrls: ['./genrate-tf-code.component.scss'],
})
export class GenrateTfCodeComponent implements OnInit {
  constructor(
    private api: ApiService,
    private share: ShareService,
    private modalCtrl: ModalController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}
  unAssignedTractorList: any = [];
  ngOnInit() {}
  ionViewWillEnter() {
    this.unAssignedTractorList = [];
    this.getTractorList();
    this.filterBy = 'ALL';
  }
  refreshList() {
    this.getTractorList();
  }
  filterBy: any = 'ALL';
  async presentModal() {
    // const modal = await this.modalCtrl.create({
    //   component: FilterByPageComponent,
    //   breakpoints: [0, 0.4, 1],
    //   initialBreakpoint: 0.4,
    //   cssClass: 'custom-modal',
    //   componentProps: {
    //     filterBy: this.filterBy,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // if (data && data?.isFilterChange) {
    //   console.log('data', data);
    //   this.filterBy = data?.filterBy;
    //   this.sortByFilter()
    // }
  }
  search={
    name:null
  }
  sortByFilter() {
    if (this.filterBy == 'ALL') {
      if (this.allTractorsSrcList?.length) {
        this.unAssignedTractorList = JSON.parse(
          JSON.stringify(this.allTractorsSrcList)
        );
      } else {
        this.unAssignedTractorList = [];
      }
    }
    if (this.filterBy == 'MAPPED') {
      this.unAssignedTractorList = this.allTractorsSrcList.filter(
        (f: any) => f?.repairMappedData?.length > 0
      );
    }
    if (this.filterBy == 'NOT_MAPPED') {
      this.unAssignedTractorList = this.allTractorsSrcList.filter(
        (f: any) => f?.repairMappedData?.length == 0
      );
    }
  }
  staffDetails: any;
  allTractorsSrcList: any = [];
  getTractorList() {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: false,
    };
    this.share?.showLoading('Loading...');
    this.api.postapi('getUnAssignedTFCode', obj).subscribe(
      (res: any) => {
        this.unAssignedTractorList = res?.data;
        this.allTractorsSrcList = res?.data;
      //  this.sortByFilter();

        this.share?.spinner?.dismiss();
        //this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
 async assignTF(tractor:any){
  const modal = await this.modalCtrl.create({
        component: EnterTfCodeComponent,
        breakpoints: [0, 0.4, 1],
        initialBreakpoint: 0.4,
        cssClass: 'custom-modal',
        componentProps: {
          tractorDetails: tractor,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data?.isActioned) {
        this.getTractorList()
      }

  }
  overview(tractor:any){

  }
  
   async viewImage(image:any){
          const modal = await this.modalCtrl.create({
            component: SingleImageShowComponent,
            componentProps: {
           
              image: image,
            },
          });
          await modal.present();
          const { data, role } = await modal.onWillDismiss();
          console.log('role', role);
      
          if (role === 'confirm') {
         
          }
        }
}
