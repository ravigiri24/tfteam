
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { PurchaseManagementComponent } from './purchase-management.component';
import { NewFindingsComponent } from './new-findings/new-findings.component';
import { CostPredictionComponent } from './cost-prediction/cost-prediction.component';
import { StorePaymentTransactionComponent } from './store-payment-transaction/store-payment-transaction.component';
const routes: Routes = [
  {
    path: "", component: PurchaseManagementComponent,
    children: [

      { path: 'new-findings', component: NewFindingsComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'cost-prediction', component: CostPredictionComponent},
      { path: 'store-Transaction', component: StorePaymentTransactionComponent},
  
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PurchaseRoutingModule {}