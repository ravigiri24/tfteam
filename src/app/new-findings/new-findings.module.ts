import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

// import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';
//import { BasicInfoComponent } from '../shared-components/basic-info/basic-info.component';
//import { PurchaseDetailsComponent } from '../shared-components/purchase-details/purchase-details.component';
// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NewFindingsComponent } from './new-findings.component';
import { NewFindingRoutingModule } from './new-findings-routing';
@NgModule({
  declarations: [
 NewFindingsComponent
  ],
  imports: [
NewFindingRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser],
})
export class NewFindingsModule {}
