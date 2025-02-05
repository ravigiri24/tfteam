
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { FranchiseManagementComponent } from './franchise-management.component';
import { NewTractorComponent } from './new-tractor/new-tractor.component';
import { StoreTansactionComponent } from './store-tansaction/store-tansaction.component';
import { StoreTractorComponent } from './store-tractor/store-tractor.component';
const routes: Routes = [
  {
    path: "", component: FranchiseManagementComponent,
    children: [

      { path: 'new-tractor', component: NewTractorComponent},
      { path: 'store-transaction', component: StoreTansactionComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'store-tractor', component: StoreTractorComponent},
    //   { path: 'cost-prediction', component: CostPredictionComponent},
  
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class FranchiseRoutingModule {}