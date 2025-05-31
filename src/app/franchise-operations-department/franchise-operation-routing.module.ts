
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { FranchiseOperationsDepartmentComponent } from './franchise-operations-department.component';
import { ReadyTractorListSalesComponent } from './ready-tractor-list-sales/ready-tractor-list-sales.component';
const routes: Routes = [
  {
    path: "", component: FranchiseOperationsDepartmentComponent,
    children: [

      { path: 'ready-tractor-sales', component: ReadyTractorListSalesComponent},
           { path: 'user-management', component: UserManagementComponent},
  
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FranchiseOerationDeparmentRoutingModule {}