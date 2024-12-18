import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaterialListComponent } from '../material-list/material-list.component';
@Component({
  selector: 'app-repair-tractor-dashboard',
  templateUrl: './repair-tractor-dashboard.component.html',
  styleUrls: ['./repair-tractor-dashboard.component.scss'],
})
export class RepairTractorDashboardComponent  implements OnInit {
tractorDetails:any
  constructor(private modalControl:ModalController,private modalCtrl:ModalController) { }

  ngOnInit() {}
  dismiss() {
    this.modalControl.dismiss();
  }
  async materalManagement(){
    const modal = await this.modalCtrl.create({
      component: MaterialListComponent,
      componentProps: {
     
        tractorDetails: this.tractorDetails,
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log('role', role);

    if (role === 'confirm') {
   
    }
  }
  goToPage(type:any){
    this.selectedTab=type
  }
  selectedTab:any='EXPENSE'
}
