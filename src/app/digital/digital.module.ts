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
@NgModule({
  declarations: [DigitalComponent,HeaderComponent,FooterComponent,FollowUpManagementComponent,CustomerManagementComponent,ReportUpManagementComponent,AddCustomerComponent,HomeComponent],
  imports: [DigitalPageRoutingModule,CommonModule, IonicModule.forRoot(),FormsModule,ReactiveFormsModule,HttpClientModule,SharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

})
  export class DigitalPageModule {}