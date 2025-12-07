import { Component, OnInit,Input ,EventEmitter,Output} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShareService } from 'src/app/share.service';
import { TractorCostingDashboardComponent } from '../tractor-costing-dashboard/tractor-costing-dashboard.component';
import { ApproveRequestActionComponent } from '../approve-request-action/approve-request-action.component';
@Component({
  selector: 'app-view-approval-list',
  templateUrl: './view-approval-list.component.html',
  styleUrls: ['./view-approval-list.component.scss'],
})
export class ViewApprovalListComponent  implements OnInit {

  constructor(public share :ShareService,private modalCtrl:ModalController) { }
@Input() approvalList:any=[]
@Input() listColorClass:any
@Input() showAction:any=true
@Input() showSummary:any=true

@Output() refreshList = new EventEmitter();
  ngOnInit() {


  }
 

    async takeAction(e: any) {
      const modal = await this.modalCtrl.create({
        component: ApproveRequestActionComponent,
  
        cssClass: 'midium-model',
        componentProps: {
          approval: e,
        },
      });
      await modal.present();
      const { data, role } = await modal.onWillDismiss();
      if (data) {
 this.refreshList.emit()
      }
    }
      async tractorSummaryDetails(request: any) {
        const modal = await this.modalCtrl.create({
          component: TractorCostingDashboardComponent,
          componentProps: {
            tractor_id: request?.tractor_id,
          },
          cssClass: 'midium-model',
        });
        await modal.present();
        const { data, role } = await modal.onWillDismiss();
        console.log('role', role);
        //   this.router.navigate(['/admin-block/view-costing-dashboard', tractor?.id]);
      }
}
