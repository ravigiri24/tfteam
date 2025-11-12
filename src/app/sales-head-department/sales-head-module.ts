


  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';


import { SharedModule } from '../shared-components/shared.module';

import { FilterPipeModule } from 'ngx-filter-pipe';

// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SalesHeadRoutingModule } from './sales-head-routing';
import { SalesHeadDepartmentComponent } from './sales-head-department.component';
import { SalesHeadDashboardComponent } from './sales-head-dashboard/sales-head-dashboard.component';
import { SalesHeadFooterComponent } from './sales-head-footer/sales-head-footer.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { SalesOfficerComponent } from './sales-officer/sales-officer.component';
import { AddSalesOfficerComponent } from './sales-officer/add-sales-officer/add-sales-officer.component';
import { AssinedStoresComponent } from './sales-officer/assined-stores/assined-stores.component';
@NgModule({
  declarations: [

SalesHeadDepartmentComponent,
SalesHeadDashboardComponent,
SalesHeadFooterComponent, 
TeamManagerComponent,
SalesOfficerComponent,
AddSalesOfficerComponent,
AssinedStoresComponent
    
  ],
  imports: [
    SalesHeadRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    
    
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },PDFGenerator,InAppBrowser],
})
  export class SalesHeadModule {}