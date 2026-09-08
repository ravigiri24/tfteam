import { HomeComponent } from '../home/home.component';
import { UserManagementComponent } from '../user-management/user-management.component';

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { FinanceDepartmentComponent } from './finance-department.component';
import { VisitingManagementComponent } from '../visiting-management/visiting-management.component';
import { LiveTractorListComponent } from './live-tractor-list/live-tractor-list.component';
import { FinancedTractorListComponent } from './financed-tractor-list/financed-tractor-list.component';
import { FinanceReportDetailsComponent } from './finance-dashboard/finance-report-details/finance-report-details.component';
import { PayoutReportDetailsComponent } from './finance-dashboard/payout-report-details/payout-report-details.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
const routes: Routes = [
  {
    path: "", component: FinanceDepartmentComponent,
    children: [
  
      { path: 'user-management', component: UserManagementComponent},
      { path: 'sold-tractor', component: LiveTractorListComponent},
      { path: 'financed-tractor', component: FinancedTractorListComponent},
      { path: 'finance-report/:srcPage', component: FinanceReportDetailsComponent},
      { path: 'payout-report', component: PayoutReportDetailsComponent},
      { path: 'finance-dashboard', component: FinanceDashboardComponent},

    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FinanceRoutingModule {}