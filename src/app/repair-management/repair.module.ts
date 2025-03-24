import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RepaireRoutingModule } from './repair-routing.module';

import { RepairManagementComponent } from './repair-management.component';

import { SharedModule } from '../shared-components/shared.module';
import { JobDashboardComponent } from './job-dashboard/job-dashboard.component';
import { RepairFooterComponent } from './repair-footer/repair-footer.component';
import { JobListComponent } from './job-list/job-list.component';
import { AddJobComponent } from './job-list/add-job/add-job.component';
import { CreateComponent } from './create/create.component';
import { RepairDashboardComponent } from './repair-dashboard/repair-dashboard.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { JobDetailComponent } from './repair-dashboard/job-detail/job-detail.component';
import { UpdateIssuesComponent } from './repair-dashboard/update-issues/update-issues.component';
import { ImageDashboardComponent } from './repair-dashboard/image-dashboard/image-dashboard.component';
import { ImageViewerComponent } from './repair-dashboard/image-viewer/image-viewer.component';
import { BuildJobComponent } from './repair-dashboard/build-job/build-job.component';
import { AddServiceChargeComponent } from './repair-dashboard/build-job/add-service-charge/add-service-charge.component';
import { AddMaterialExpenseComponent } from './repair-dashboard/build-job/add-material-expense/add-material-expense.component';
import { JobCardComponent } from './repair-dashboard/job-card/job-card.component';
//import { Printer } from '@ionic-native/printer/ngx';
import { ReportsComponent } from './reports/reports.component';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ReportFilterComponent } from './reports/report-filter/report-filter.component';
import { AddReducePartComponent } from './repair-dashboard/build-job/add-reduce-part/add-reduce-part.component';
@NgModule({
  declarations: [
    RepairManagementComponent,
    JobDashboardComponent,
    RepairFooterComponent,
    JobListComponent,
    AddJobComponent,
    CreateComponent,
    RepairDashboardComponent,
    JobDetailComponent,
    UpdateIssuesComponent,
    ImageViewerComponent,
    ImageDashboardComponent,
    BuildJobComponent,
    AddServiceChargeComponent,
    AddMaterialExpenseComponent,
    JobCardComponent,
    AddReducePartComponent,
    ReportsComponent,
    ReportFilterComponent
    
  ],
  imports: [
    RepaireRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    
    
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },PDFGenerator,InAppBrowser],
})
export class RepairManagementModule {}
