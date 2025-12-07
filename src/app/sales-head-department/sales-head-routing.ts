

import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SalesHeadDashboardComponent } from './sales-head-dashboard/sales-head-dashboard.component';
import { SalesHeadDepartmentComponent } from './sales-head-department.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { SalesOfficerComponent } from './sales-officer/sales-officer.component';
import { EnquiryListSalesHeadComponent } from './enquiry-list-sales-head/enquiry-list-sales-head.component';
import { ApprovalRequestComponent } from './approval-request/approval-request.component';
const routes: Routes = [
  {
    path: "", component: SalesHeadDepartmentComponent,
    children: [

   
       { path: 'user-management', component: UserManagementComponent},
       { path: 'sales-head-dashboard', component: SalesHeadDashboardComponent},
       { path: 'sales-head-enquiry-list', component: EnquiryListSalesHeadComponent},
       { path: 'approval-list', component: ApprovalRequestComponent},
       { path: 'team-manager/:srcPage', component: TeamManagerComponent},
       { path: 'sales-officer/:srcPage', component: SalesOfficerComponent},
  
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

    export class SalesHeadRoutingModule {}