import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HrDepartmentComponent } from './hr-department.component';
import { HrFooterComponent } from './hr-footer/hr-footer.component';
import { HrDeparmentRoutingModule } from './hr-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';
import { SalarySlipComponent } from './salary-slip/salary-slip.component';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AddOfferLetterComponent } from './offer-letter/add-offer-letter/add-offer-letter.component';
@NgModule({
  declarations: [
    HrDepartmentComponent,
    HrFooterComponent,
    SalarySlipComponent,
    AddOfferLetterComponent,
    OfferLetterComponent
  ],
  imports: [
    CommonModule,
    HrDeparmentRoutingModule,
      
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        FilterPipeModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser],
})
export class HrDeparmentModule {}