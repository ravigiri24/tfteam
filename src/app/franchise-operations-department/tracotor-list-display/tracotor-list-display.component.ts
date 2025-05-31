import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { ShareService } from 'src/app/share.service';
import { TracotorSettingsComponent } from '../tracotor-settings/tracotor-settings.component';
@Component({
  selector: 'app-tracotor-list-display',
  templateUrl: './tracotor-list-display.component.html',
  styleUrls: ['./tracotor-list-display.component.scss'],
})
export class TracotorListDisplayComponent  implements OnInit {

  constructor(private modalCtrl:ModalController,private share:ShareService,private api:ApiService) { }

  ngOnInit() {
    this.getTractorList()
  }
dismiss(){
  this.modalCtrl.dismiss()
}
search={
  registractionNo:null
}
staffDetails:any
  allTractorsSrcList: any = [];
  tractorList: any = [];
  getTractorList(loader: any = false) {

    let staffDetails: any = this.share.get_staff();
    this.staffDetails = JSON.parse(staffDetails);

    let obj = {
      operate: this.staffDetails?.staffCode,
   

    };

      this.share.showLoading('Loading...');
   
  
    this.api.postapi('unMappesTractorsList', obj).subscribe(
      (res: any) => {
        this.tractorList = res?.data;
        this.allTractorsSrcList = res?.data;
        // this.newArivalsList=this.newArivalsList.filter((f:any)=>f?.tractor_status=='NEW_ARRIVAL')
   
        this.share.spinner.dismiss();
  
      },
      (error: any) => {}
    );
  }
    async presentModal(tractor:any) {
        const modal = await this.modalCtrl.create({
          component: TracotorSettingsComponent,
          breakpoints: [0, 0.4, 1],
          initialBreakpoint: 0.7,
          cssClass: 'custom-modal',
          componentProps: {
     tractorDetails:tractor
      
          },
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        if (data && data?.isFilterChange) {
          console.log('data', data);
          // this.filterBy = data?.filterBy;
          // this.sortByFilter()
        }
    
      }
}
