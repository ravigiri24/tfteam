

import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { RtoManagementComponent } from './rto-management.component';

import { RtoNocComponent } from './rto-noc/rto-noc.component';
import { RtoSoldProcessComponent } from './rto-sold-process/rto-sold-process.component';
const routes: Routes = [
  {
    path: "", component: RtoManagementComponent,
    children: [

   
       { path: 'user-management', component: UserManagementComponent},
       { path: 'rto-noc', component: RtoNocComponent},
       { path: 'rto-sold-process', component: RtoSoldProcessComponent},
  

   
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

    export class RtoRoutingModule {}