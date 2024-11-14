import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { FollowUpManagementComponent } from './follow-up-management/follow-up-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { ReportUpManagementComponent } from './report-up-management/report-up-management.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCustomerComponent } from './customer-management/add-customer/add-customer.component';
import { SearchpipePipe } from './searchpipe.pipe';

@NgModule({
  declarations: [AppComponent,HomeComponent,HeaderComponent,FooterComponent,UserManagementComponent,FollowUpManagementComponent,CustomerManagementComponent,ReportUpManagementComponent,AddCustomerComponent,SearchpipePipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
