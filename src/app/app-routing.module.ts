import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';
import { HrDeparmentModule } from './hr-department/hr.module';
// import { HomeComponent } from './home/home.component';
// import { UserManagementComponent } from './user-management/user-management.component';
// import { FollowUpManagementComponent } from './follow-up-management/follow-up-management.component';
// import { CustomerManagementComponent } from './customer-management/customer-management.component';
// import { ReportUpManagementComponent } from './report-up-management/report-up-management.component';

const routes: Routes = [
  {
    path: 'tab',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'digital',
    loadChildren: () => import('./digital/digital.module').then(m => m.DigitalPageModule)
  },
  {
    path: 'operational',
    loadChildren: () => import('./operational/operational.module').then(m => m.OperationlPageModule)
  },
  {
    path: 'admin-block',
    loadChildren: () => import('./admin-management/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'purchase-management',
    loadChildren: () => import('./purchase-management/purchase.module').then(m => m.PurchaseManagementModule)
  },
  {
    path: 'franchise-management',
    loadChildren: () => import('./franchise-management/franchise.module').then(m => m.FranchiseManagementModule)
  },
  {
    path: 'repair-management',
    loadChildren: () => import('./repair-management/repair.module').then(m => m.RepairManagementModule)
  },
  {
    path: 'login',
    canActivate: [AuthService],
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'hr-deparment',
    loadChildren: () => import('./hr-department/hr.module').then(m => m.HrDeparmentModule)
  },
    {
    path: 'franchise-operation-deparment',
    loadChildren: () => import('./franchise-operations-department/franchaise-operation-deparment.module').then(m => m.FranchiseOperationDepartmentModule)
  },
    {
    path: 'transport-department',
    loadChildren: () => import('./transport-management/transport.module').then(m => m.TransportModule)
  },
  // { path: 'home', component: HomeComponent},
  // { path: 'user-management', component: UserManagementComponent},
  // { path: 'follow-up-management', component: FollowUpManagementComponent},
  // { path: 'customer-management', component: CustomerManagementComponent},
  // { path: 'report-management', component: ReportUpManagementComponent},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
