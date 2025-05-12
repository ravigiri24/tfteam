
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { HrDepartmentComponent } from './hr-department.component';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
const routes: Routes = [
  {
    path: "", component: HrDepartmentComponent,
    children: [

  
      { path: 'user-management', component: UserManagementComponent},
      { path: 'offer-letter', component: OfferLetterComponent},
      { path: 'salary-slip', component: SalarySlipComponent},
    
     
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class HrDeparmentRoutingModule {}