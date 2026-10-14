import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FinanceRoutingModule } from './finance-routing.module';
import { LiveTractorListComponent } from './live-tractor-list/live-tractor-list.component';
import { FinanceFooterComponent } from './finance-footer/finance-footer.component';
import { FinanceDepartmentComponent } from './finance-department.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FinancedTractorListComponent } from './financed-tractor-list/financed-tractor-list.component';
import { FinanceOptionsComponent } from './finance-options/finance-options.component';
import { PayoutDetailsComponent } from './payout-details/payout-details.component';
import { UpdatePayoutPercentComponent } from './payout-details/update-payout-percent/update-payout-percent.component';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { UploadFinanceDataComponent } from './finance-dashboard/upload-finance-data/upload-finance-data.component';
import { MonthWiseUploadDataComponent } from './finance-dashboard/month-wise-upload-data/month-wise-upload-data.component';
import { UploadDataFinanceComponent } from './finance-dashboard/month-wise-upload-data/upload-data-finance/upload-data-finance.component';
import { StoreWiseCashComponent } from './finance-dashboard/store-wise-cash/store-wise-cash.component';
// import { ShowSalesDetailsComponent } from './show-sales-details/show-sales-details.component';
@NgModule({
  declarations: [
  LiveTractorListComponent,
  FinancedTractorListComponent,
  FinanceFooterComponent,
  FinanceDepartmentComponent,
  FinanceOptionsComponent,
  PayoutDetailsComponent,
  UpdatePayoutPercentComponent,
  FinanceDashboardComponent,
  UploadFinanceDataComponent,
  MonthWiseUploadDataComponent,
  UploadDataFinanceComponent,
  StoreWiseCashComponent
  //ShowSalesDetailsComponent
  ],
  imports: [
    FinanceRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule
   
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser,
    PDFGenerator,
  ],
})
export class FinanceDepartmentModule {}