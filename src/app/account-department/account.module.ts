import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AccountRoutingModule } from './account-routing.module';
import { AccountDepartmentComponent } from './account-department.component';
import { AccountFooterComponent } from './account-footer/account-footer.component';
import { AccountTractorListComponent } from './account-tractor-list/account-tractor-list.component';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';
import { FilterPipeModule } from 'ngx-filter-pipe';

// import { ShowSalesDetailsComponent } from './show-sales-details/show-sales-details.component';
@NgModule({
  declarations: [
    AccountDepartmentComponent,
    AccountFooterComponent,
    AccountTractorListComponent,
    AccountDashboardComponent,

  //ShowSalesDetailsComponent
  ],
  imports: [
    AccountRoutingModule,
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
export class AccountDepartmentModule {}
