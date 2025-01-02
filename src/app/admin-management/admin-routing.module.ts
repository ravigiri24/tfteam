import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { DigitalAnalyseComponent } from './digital-analyse/digital-analyse.component';
const routes: Routes = [
  {
    path: "", component: AdminManagementComponent,
    children: [

      { path: 'digital-analyse', component: DigitalAnalyseComponent},
  
      
   
    ],

  }
  

  ];
  @NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AdminRoutingModule {}