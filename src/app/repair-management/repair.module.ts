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
@NgModule({
  declarations: [
    RepairManagementComponent,
    JobDashboardComponent,
    RepairFooterComponent,
    JobListComponent,
    AddJobComponent,
    CreateComponent,
    RepairDashboardComponent,
    JobDetailComponent
    
  ],
  imports: [
    RepaireRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule
    
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class RepairManagementModule {}
