

import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';
import { TarritoryManagerComponent } from './tarritory-manager.component';
import { TarritoryManagerApprovalListComponent } from './tarritory-manager-approval-list/tarritory-manager-approval-list.component';
import { TarritoryManagerTractorListComponent } from './tarritory-manager-tractor-list/tarritory-manager-tractor-list.component';
import { EnquiryListTarritoryManagerComponent } from './enquiry-list-tarritory-manager/enquiry-list-tarritory-manager.component';
const routes: Routes = [
  {
    path: "", component: TarritoryManagerComponent,
    children: [

   
       { path: 'user-management', component: UserManagementComponent},
       { path: 'tarritory-manager-enquiry-list', component: EnquiryListTarritoryManagerComponent},
       { path: 'tarritory-manager-tractor-list', component: TarritoryManagerTractorListComponent},
      { path: 'tarritory-manager-approval-list', component: TarritoryManagerApprovalListComponent},

  
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

    export class TarritoryRoutingModule {}