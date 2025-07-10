
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { OperationalComponent } from './operational.component';
import { TransportManagementComponent } from '../transport-management/transport-management.component';
import { AddNewArrivalsComponent } from '../new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
import { TransportCostListComponent } from '../transport-management/transport-cost-list/transport-cost-list.component';
import { MaintainanceManagementComponent } from '../maintainance-management/maintainance-management.component';
import { AllTractorListComponent } from '../all-tractor-list/all-tractor-list.component';
import { TractorDashboardComponent } from '../shared-components/tractor-dashboard/tractor-dashboard.component';
import { TractorSellsDetailsComponent } from '../tractor-sells-details/tractor-sells-details.component';
import { BufferStockTractorsComponent } from '../buffer-stock-tractors/buffer-stock-tractors.component';
import { GenrateTfCodeComponent } from './genrate-tf-code/genrate-tf-code.component';
const routes: Routes = [
  {
    path: "", component: OperationalComponent,
    children: [

      // { path: 'new-arrivals', component: NewArrivalsManagementComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'add-new-arrivals', component: AddNewArrivalsComponent},
      { path: 'transport-management', component: TransportManagementComponent},
      { path: 'maintainance-management', component: MaintainanceManagementComponent},
      { path: 'all-tractor-management', component: AllTractorListComponent},
      { path: 'sell-tractor-details', component: TractorSellsDetailsComponent},
      { path: 'buffer-stock', component: BufferStockTractorsComponent},
      { path: 'generate-tf-code', component: GenrateTfCodeComponent},
      {
        path: 'edit-newarrivals/:id',
        component: AddNewArrivalsComponent,
      },
      {
        path: 'add-cost/:id',
        component: TransportCostListComponent,
      },
      {
        path: 'view-dashboard/:id/:srcPage',
        component: TractorDashboardComponent,
      },
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class OperationlPageRoutingModule {}