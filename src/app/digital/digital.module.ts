import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HomeComponent } from '../home/home.component';
import { DigitalPageRoutingModule } from './digital-routing.module';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { FollowUpManagementComponent } from '../follow-up-management/follow-up-management.component';
import { CustomerManagementComponent } from '../customer-management/customer-management.component';
import { ReportUpManagementComponent } from '../report-up-management/report-up-management.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCustomerComponent } from '../customer-management/add-customer/add-customer.component';
// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { DigitalComponent } from './digital.component';
import { AddCustomerPopUpComponent } from '../customer-management/add-customer-pop-up/add-customer-pop-up.component';
import { SearchCustomerComponent } from '../customer-management/search-customer/search-customer.component';
import { ReviewPageComponent } from '../customer-management/review-page/review-page.component';
import { ViewCustomerDataComponent } from '../customer-management/view-customer-data/view-customer-data.component';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@NgModule({
  declarations: [DigitalComponent,HeaderComponent,FooterComponent,FollowUpManagementComponent,CustomerManagementComponent,ReportUpManagementComponent,AddCustomerComponent,HomeComponent,SearchCustomerComponent,AddCustomerPopUpComponent,ReviewPageComponent,ViewCustomerDataComponent],
  imports: [DigitalPageRoutingModule,CommonModule, IonicModule.forRoot(),FormsModule,ReactiveFormsModule,HttpClientModule,SharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser,PDFGenerator],

})
  export class DigitalPageModule {}