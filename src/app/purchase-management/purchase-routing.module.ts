

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { PurchaseManagementComponent } from './purchase-management.component';
import { NewFindingsComponent } from './new-findings/new-findings.component';
import { CostPredictionComponent } from './cost-prediction/cost-prediction.component';
import { StorePaymentTransactionComponent } from './store-payment-transaction/store-payment-transaction.component';
import { AddNewArrivalsComponent } from 'src/app/new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
import { NewArrivalsManagementComponent } from 'src/app/new-arrivals-management/new-arrivals-management.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
const routes: Routes = [
  {
    path: "", component: PurchaseManagementComponent,
    children: [

      { path: 'new-findings', component: NewFindingsComponent},
      { path: 'add-new-arrivals/:random_number/:srcPage', component: AddNewArrivalsComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'cost-prediction', component: CostPredictionComponent},
      { path: 'store-Transaction', component: StorePaymentTransactionComponent},
      { path: 'new-arrivals', component: NewArrivalsManagementComponent},
      { path: 'inventory-list', component: InventoryListComponent},
    
    
     
          {
        path: 'edit-newarrivals/:id/:srcPage',
        component: AddNewArrivalsComponent,
      },
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PurchaseRoutingModule {}