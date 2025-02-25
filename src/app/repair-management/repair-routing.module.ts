
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { RepairManagementComponent } from './repair-management.component';
import { JobDashboardComponent } from './job-dashboard/job-dashboard.component';
const routes: Routes = [
  {
    path: "", component: RepairManagementComponent,
    children: [

       { path: 'job-dashboard', component: JobDashboardComponent},
       { path: 'user-management', component: UserManagementComponent},
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
  export class RepaireRoutingModule {}