
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SalesOfficerDepartComponent } from './sales-officer-depart.component';
import { TractorListFranchiseComponent } from './tractor-list-franchise/tractor-list-franchise.component';
import { SalesOfficerDashboardComponent } from './sales-officer-dashboard/sales-officer-dashboard.component';
const routes: Routes = [
  {
    path: "", component: SalesOfficerDepartComponent,
    children: [

   
       { path: 'user-management', component: UserManagementComponent},
       { path: 'tractor-list-francise', component: TractorListFranchiseComponent},
       { path: 'so-dashbord', component: SalesOfficerDashboardComponent},
    

   
    //   { path: 'user-management', component: UserManagementComponent},
    //   { path: 'cost-prediction', component: CostPredictionComponent},
    //   { path: 'store-Transaction', component: StorePaymentTransactionComponent},
  
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SalesOfficerRoutingModule {}