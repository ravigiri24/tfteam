import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';
import { LeadRoutingModule } from './lead-department-routing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LeadFooterComponent } from './lead-footer/lead-footer.component';
import { LeadDepartmentComponent } from './lead-department.component';
import { CustomerListVisitngComponent } from './customer-list-visitng/customer-list-visitng.component';
import { CustomerListDistrictWiseComponent } from './customer-list-district-wise/customer-list-district-wise.component';
import { CustomerListFollowUpComponent } from './customer-list-follow-up/customer-list-follow-up.component';
@NgModule({
  declarations: [
LeadFooterComponent,
LeadDepartmentComponent,
CustomerListVisitngComponent,
CustomerListDistrictWiseComponent,
CustomerListFollowUpComponent
  ],
  imports: [
        CommonModule,
        LeadRoutingModule,
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        FilterPipeModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser],
})
export class LeadDepartmentModule {}