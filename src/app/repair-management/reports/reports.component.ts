import { Component, OnInit } from '@angular/core';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent  implements OnInit {

  constructor(    public modalCtrl: ModalController) { }

  ngOnInit() {}
  async showReport(reportType:any='Job List') {
    const modal = await this.modalCtrl.create({
      component: ReportFilterComponent,
      componentProps: {

        reportType: reportType,
     
      },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
  
  }
}
