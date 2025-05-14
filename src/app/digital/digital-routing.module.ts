import { HomeComponent } from '../home/home.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { FollowUpManagementComponent } from '../follow-up-management/follow-up-management.component';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { ReportUpManagementComponent } from '../report-up-management/report-up-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { DigitalComponent } from './digital.component'; 
import { VisitingManagementComponent } from '../visiting-management/visiting-management.component';
const routes: Routes = [
  {
    path: "", component: DigitalComponent,
    children: [
      { path: 'home', component: HomeComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'follow-up-management', component: FollowUpManagementComponent},
      { path: 'visiting-management', component: VisitingManagementComponent},
      { path: 'customer-management', component: CustomerManagementComponent},
    
      { path: 'report-management', component: ReportUpManagementComponent},
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DigitalPageRoutingModule {}