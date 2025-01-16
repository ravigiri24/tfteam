import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/api.service';

import { ShareService } from 'src/app/share.service';

import { ModalController } from '@ionic/angular';
import { TractorDashboardComponent } from '../tractor-dashboard/tractor-dashboard.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-tractor-costing-list',
  templateUrl: './tractor-costing-list.component.html',
  styleUrls: ['./tractor-costing-list.component.scss'],
})
export class TractorCostingListComponent  implements OnInit {


  constructor(private api:ApiService,private share:ShareService,private modalCtrl:ModalController,private router:Router) { }
alltractorList:any=[]
  ngOnInit() {}
  ionViewWillEnter() {
    this.alltractorList = [];
 
    this.getBrandList()
  }
  refreshList(){
    this.getTractorList()
  }
  brandList:any=[]
  selectedBrand:any
  getBrandList(loader:any=false){
    let staffDetails: any = this.share.get_staff();
   
    this.staffDetails = JSON.parse(staffDetails);
        //if(loader){
        this.share.showLoading('Loading...');
       // }
        let obj: any = this.share.getListObj('brand', false, [], true);
        obj.storeId = this.staffDetails?.storeId;
 
        setTimeout(() => {
          this.api.postapi('getList', obj).subscribe(
            (res: any) => {
          this.brandList=res?.data
          this.brandList=this.brandList.reverse()
      
          console.log("  this.brandList",  this.brandList);
          if(!loader){
            this.selectedBrand=  this.brandList[0]?.id
             
          this.getTractorList();
           //   this.share.spinner?.dismiss();
          }
           
            },
            (error: any) => {}
          );
        }, 0);
  }
  getListByBrand(){
    console.log("getListByBrand",this.selectedBrand);
    this.getTractorList(true)
  }
  staffDetails:any

  getTractorList(loader:any=false) {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
      isLive: true,
      brandId: this.selectedBrand,
    };
    if(loader){
    this.share.showLoading('Loading...');
    }
    this.api.postapi('getTractorListBranchWise', obj).subscribe(
      (res: any) => {
        this.alltractorList = res.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
  

        this.share?.spinner?.dismiss();
        this.backupList = res.data;
      },
      (error: any) => {}
    );
  }
 async viewImage(tractor:any){
    // const modal = await this.modalCtrl.create({
    //   component: ImageViewerComponent,
    //   componentProps: {
     
    //     tarctor_id: tractor.id,
    //   },
    // });
    // await modal.present();
    // const { data, role } = await modal.onWillDismiss();
    // console.log('role', role);

    // if (role === 'confirm') {
   
    // }
  }
  async viewTractorDashboard(tractor:any){
    const modal = await this.modalCtrl.create({
      component: TractorDashboardComponent,
      componentProps: {
     
        tractorDetails: tractor,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

  this.getTractorList()
  }
  backupList:any=[]
  tractorDashboard(tractor: any) {
    this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
  }
  backToList(){
    this.router.navigate(['/operational/all-tractor-management'])
  }
}


