import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddServiceChargeComponent } from './add-service-charge/add-service-charge.component';
@Component({
  selector: 'app-build-job',
  templateUrl: './build-job.component.html',
  styleUrls: ['./build-job.component.scss'],
})
export class BuildJobComponent  implements OnInit {
@Input() jobDetails:any
  constructor(private modalControl:ModalController) { }

 
  selectedTab: any = 'SERVICE';

  jobId: any;
  ngOnInit() {}
  goToPage(tab: any) {
    this.selectedTab = tab;
  }

  addParts(){

  }
  async addService(expense_head: any, obj: any = null) {
    const modal = await this.modalControl.create({
      component: AddServiceChargeComponent,
      componentProps: {
        tractorDetails: this.jobDetails,
        expense_head: expense_head,
        editData: obj,
      },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    //this.getServiceList();
    console.log('role', role);

    if (role === 'confirm') {
    }
  }
}
