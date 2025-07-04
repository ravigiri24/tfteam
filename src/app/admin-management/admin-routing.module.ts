import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { DigitalAnalyseComponent } from './digital-analyse/digital-analyse.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { TractorCostingListComponent } from '../shared-components/tractor-costing-list/tractor-costing-list.component';
import { TractorCostingDashboardComponent } from '../shared-components/tractor-costing-dashboard/tractor-costing-dashboard.component';
import { ReportsTractorComponent } from './reports-tractor/reports-tractor.component';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { MasterSheetsComponent } from './master-sheets/master-sheets.component';
const routes: Routes = [
  {
    path: "", component: AdminManagementComponent,
    children: [

      { path: 'digital-analyse', component: DigitalAnalyseComponent},
  
         { path: 'dashboard-overview', component: DashboardOverviewComponent},
       
         { path: 'master-sheet/:srcPage', component: MasterSheetsComponent},
         { path: 'reports-tractor', component: ReportsTractorComponent},
         { path: 'user-management', component: UserManagementComponent},
         { path: 'tractor-costing', component: TractorCostingListComponent},
         {
              path: 'view-costing-dashboard/:id',
              component: TractorCostingDashboardComponent,
            },
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule {}