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
import { SalesOfficerDepartComponent } from './sales-officer-depart.component';
import { SalesOfficerRoutingModule } from './sell-officer-depart-routing.module';
import { SalesOfficerFooterComponent } from './sales-officer-footer/sales-officer-footer.component';
import { TractorListFranchiseComponent } from './tractor-list-franchise/tractor-list-franchise.component';
import { SalesOfficerDashboardComponent } from './sales-officer-dashboard/sales-officer-dashboard.component';
import { EnquireListComponent } from './enquire-list/enquire-list.component';
import { AddEnqiuryComponent } from './add-enqiury/add-enqiury.component';
import { ViewModelsComponent } from './add-enquiry/view-models/view-models.component';
import { CloseEnquiryComponent } from './close-enquiry/close-enquiry.component';
@NgModule({
  declarations: [
 SalesOfficerDepartComponent,
 SalesOfficerFooterComponent,
 TractorListFranchiseComponent,
 SalesOfficerDashboardComponent,
 EnquireListComponent,
 AddEnqiuryComponent,
 ViewModelsComponent,
 CloseEnquiryComponent
    
  ],
  imports: [
    SalesOfficerRoutingModule,
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
export class SellDepartmentModule {}
