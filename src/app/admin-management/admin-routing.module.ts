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
import { PendingReportsComponent } from './pending-reports/pending-reports.component';
import { LeadEmployeeMgmtComponent } from './lead-employee-mgmt/lead-employee-mgmt.component';
import { StoreManagementComponent } from './store-management/store-management.component';
//import { TeamManagerComponent } from '../shared-components/team-manager/team-manager.component';
import { TeamManagerComponent } from '../sales-head-department/team-manager/team-manager.component';
import { SalesOfficerComponent } from '../sales-head-department/sales-officer/sales-officer.component';
import { UnsoldTractorListComponent } from './unsold-tractor-list/unsold-tractor-list.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SpeceficUnsoldTractorListComponent } from './specefic-unsold-tractor-list/specefic-unsold-tractor-list.component';
import { LastActivityComponent } from './last-activity/last-activity.component';
import { SalesAnalysisComponent } from './sales-analysis/sales-analysis.component';
import { BufferStockListComponent } from './buffer-stock-list/buffer-stock-list.component';
import { ViewMaintainanceCostComponent } from './view-maintainance-cost/view-maintainance-cost.component';
import { FindingReportsComponent } from './finding-reports/finding-reports.component';
const routes: Routes = [
  {
    path: "", component: AdminManagementComponent,
    children: [

      { path: 'digital-analyse', component: DigitalAnalyseComponent},
  
         { path: 'dashboard-overview', component: DashboardOverviewComponent},
       
         { path: 'master-sheet/:srcPage', component: MasterSheetsComponent},
         { path: 'sales-report/:srcPage', component: SalesReportComponent},
         { path: 'unsold-tractor-sheet/:srcPage', component: UnsoldTractorListComponent},
         { path: 'unsold-tractor-sheet-specific/:srcPage', component: SpeceficUnsoldTractorListComponent},
         { path: 'work-sheet/:srcPage', component: PendingReportsComponent},
         { path: 'view-maintainance/:srcPage', component: ViewMaintainanceCostComponent},
         { path: 'reports-tractor', component: ReportsTractorComponent},
         { path: 'user-management', component: UserManagementComponent},
         { path: 'tractor-costing', component: TractorCostingListComponent},
         { path: 'transaction-overview/:srcPage', component: SalesAnalysisComponent},
         { path: 'lead-mgmt-employee/:srcPage', component: LeadEmployeeMgmtComponent},
         { path: 'sales-manager-list/:srcPage', component: StoreManagementComponent},
         { path: 'last-activity/:srcPage', component: LastActivityComponent},
         { path: 'buffer-list/:srcPage', component: BufferStockListComponent},
      //   { path: 'team-manager-list/:srcPage', component: TeamManagerComponent},
         { path: 'team-manager-list/:srcPage', component: TeamManagerComponent},
         { path: 'sales-officer/:srcPage', component: SalesOfficerComponent},
         { path: 'finding-reports/:srcPage', component: FindingReportsComponent},
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