
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SellDepartmentComponent } from './sell-department.component';
import { LiveTractorListComponent } from './live-tractor-list/live-tractor-list.component';
import { SoldTractorListComponent } from './sold-tractor-list/sold-tractor-list.component';
const routes: Routes = [
  {
    path: "", component: SellDepartmentComponent,
    children: [

   
       { path: 'user-management', component: UserManagementComponent},
       { path: 'live-tractor-list', component: LiveTractorListComponent},
       { path: 'sold-tractor-list', component: SoldTractorListComponent},
   
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
  export class SellDepartRoutingModule {}