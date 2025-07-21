
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { NewFindingsComponent } from './new-findings.component';
const routes: Routes = [
  {
    path: "", component: NewFindingsComponent,
    children: [
     { path: 'user-management', component: UserManagementComponent},
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NewFindingRoutingModule {}