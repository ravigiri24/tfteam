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
import { SellDepartmentComponent } from './sell-department.component';
import { SellDepartRoutingModule } from './sell-routing.module';
import { LiveTractorListComponent } from './live-tractor-list/live-tractor-list.component';
import { SoldTractorListComponent } from './sold-tractor-list/sold-tractor-list.component';
import { FooterSellDepartmentComponent } from './footer-sell-department/footer-sell-department.component';
import { SellOptionsComponent } from './sell-options/sell-options.component';
@NgModule({
  declarations: [
  SellDepartmentComponent,
  LiveTractorListComponent,
  SoldTractorListComponent,
  FooterSellDepartmentComponent,
  SellOptionsComponent
    
  ],
  imports: [
    SellDepartRoutingModule,
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
