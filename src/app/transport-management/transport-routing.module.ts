
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { TransportManagementComponent } from './transport-management.component';
import { TransportDepartmentComponent } from './transport-department/transport-department.component';
import { AddCostComponent } from './add-cost/add-cost.component';
import { TransportCostListComponent } from './transport-cost-list/transport-cost-list.component';
const routes: Routes = [
  {
    path: "", component: TransportDepartmentComponent,
    children: [

       { path: 'transport-management', component: TransportManagementComponent},
     
         {
               path: 'add-cost/:id',
               component: TransportCostListComponent,
             },
        { path: 'user-management', component: UserManagementComponent},
    //    { path: 'create-job/:srcPage', component: CreateComponent},
    //    { path: 'update-job/:id/:srcPage', component: CreateComponent},
    //    { path: 'repair-dashboard/:id/:srcPage', component: RepairDashboardComponent},
    //    { path: 'job-list', component:  JobListComponent   },
    //    { path: 'report-dashboard', component:  ReportsComponent   },
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
  export class TransportRoutingModule {}