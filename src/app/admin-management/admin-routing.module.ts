import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { DigitalAnalyseComponent } from './digital-analyse/digital-analyse.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { TractorCostingListComponent } from '../shared-components/tractor-costing-list/tractor-costing-list.component';
import { TractorCostingDashboardComponent } from '../shared-components/tractor-costing-dashboard/tractor-costing-dashboard.component';
const routes: Routes = [
  {
    path: "", component: AdminManagementComponent,
    children: [

      { path: 'digital-analyse', component: DigitalAnalyseComponent},
  
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