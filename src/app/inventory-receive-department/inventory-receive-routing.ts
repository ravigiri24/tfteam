
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { InventoryReceiveDepartmentComponent } from './inventory-receive-department.component';
import { InventoryReceivedListComponent } from './inventory-received-list/inventory-received-list.component';
import { AddNewArrivalsComponent } from '../new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
const routes: Routes = [
  {
    path: "", component: InventoryReceiveDepartmentComponent,
    children: [

  
      { path: 'user-management', component: UserManagementComponent},
      { path: 'inven-received-list', component: InventoryReceivedListComponent},
      { path: 'add-new-arrivals/:random_number/:srcPage', component: AddNewArrivalsComponent},
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
  export class InventoryReceiveRoutingModule {}