import { HomeComponent } from '../home/home.component';
import { UserManagementComponent } from '../user-management/user-management.component';

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccountDepartmentComponent } from './account-department.component';
import { AccountFooterComponent } from './account-footer/account-footer.component';
import { VisitingManagementComponent } from '../visiting-management/visiting-management.component';
import { AccountTractorListComponent } from './account-tractor-list/account-tractor-list.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { TransactionHistoryAccountComponent } from '../shared-components/transaction-history-account/transaction-history-account.component';

const routes: Routes = [

  {
    path: "", component: AccountDepartmentComponent,
    children: [
    { path: 'acocount-footer', component: AccountFooterComponent },
      { path: 'user-management', component: UserManagementComponent},
      { path: 'account-tractor', component: AccountTractorListComponent},
      { path: 'account-dashboard', component: AccountDashboardComponent},
      { path: 'transaction-history-account', component: TransactionHistoryAccountComponent },
  

    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AccountRoutingModule {}
