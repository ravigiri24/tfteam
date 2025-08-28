
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { LeadDepartmentComponent } from './lead-department.component';
import { CustomerListVisitngComponent } from './customer-list-visitng/customer-list-visitng.component';
import { CustomerListDistrictWiseComponent } from './customer-list-district-wise/customer-list-district-wise.component';
import { CustomerListFollowUpComponent } from './customer-list-follow-up/customer-list-follow-up.component';
const routes: Routes = [
  {
    path: "", component: LeadDepartmentComponent,
    children: [

  
      { path: 'user-management', component: UserManagementComponent},
      { path: 'visiting-management', component: CustomerListVisitngComponent},
      { path: 'customer-management', component: CustomerListDistrictWiseComponent},
      { path: 'follow-up-management', component: CustomerListFollowUpComponent},
    
     
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class LeadRoutingModule {}