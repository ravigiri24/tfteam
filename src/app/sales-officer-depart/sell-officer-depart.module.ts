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
@NgModule({
  declarations: [
 SalesOfficerDepartComponent,
 SalesOfficerFooterComponent,
 TractorListFranchiseComponent
    
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
