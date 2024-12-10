
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { OperationalComponent } from './operational.component';
import { AddNewArrivalsComponent } from '../new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
const routes: Routes = [
  {
    path: "", component: OperationalComponent,
    children: [

      { path: 'new-arrivals', component: NewArrivalsManagementComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'add-new-arrivals', component: AddNewArrivalsComponent},
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OperationlPageRoutingModule {}