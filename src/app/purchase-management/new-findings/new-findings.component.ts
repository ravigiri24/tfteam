import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/share.service';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AddNewFindingsComponent } from './add-new-findings/add-new-findings.component';
import { ImageViewerComponent } from 'src/app/maintainance-management/image-viewer/image-viewer.component';
@Component({
  selector: 'app-new-findings',
  templateUrl: './new-findings.component.html',
  styleUrls: ['./new-findings.component.scss'],
})
export class NewFindingsComponent  implements OnInit {

  constructor(    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private share: ShareService,
    private api: ApiService,
    private route: Router) { }

  ngOnInit() {
 
  }
  ionViewWillEnter() {
    this.newFindingList = [];
    this.getTractorList()
  }
  refreshList() {
    this.getTractorList();
  }
  addNewFinding(){

  }
    async viewImage(new_finding:any){
      const modal = await this.modalCtrl.create({
        component: ImageViewerComponent,
        componentProps: {
       
          tarctor_id: new_finding?.id,
          imageGroup:'NEW_FINDING',
          uploadPhoto:true,
          apiName:"saveNewFindingImage",
          getApiName:"getNewFindingImages"
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
     
      }
    }
   async showModal(dataUpdate: any = null) {
      const modal = await this.modalCtrl.create({
        component: AddNewFindingsComponent,
        componentProps: {
    
          data: dataUpdate,
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
     this.getTractorList()
      }
    }
    async viewData(dataUpdate: any = null) {
      const modal = await this.modalCtrl.create({
        component: AddNewFindingsComponent,
        componentProps: {
    
          data: dataUpdate,
          isShowOnly:true
        
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      console.log('role', role);
  
      if (role === 'confirm') {
    // this.getTractorList()
      }
    }
  staffDetails:any
  newFindingList:any=[]
  getTractorList(msg: any = 'Loading...') {
    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
    
    };
    this.share.showLoading(msg);
    this.api.postapi('getNewFindingList', obj).subscribe(
      (res: any) => {
        this.newFindingList = res.data;
     
        this.share.spinner.dismiss();
     
      },
      (error: any) => {}
    );
  }
  openEdit(tractor:any,ind:any){
this.showModal(tractor)
  }

}
