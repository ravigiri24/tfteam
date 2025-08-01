import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HeaderComponent } from './header/header.component';
// import { FooterComponent } from './footer/footer.component';
// import { UserManagementComponent } from './user-management/user-management.component';
// import { FollowUpManagementComponent } from './follow-up-management/follow-up-management.component';
// import { CustomerManagementComponent } from './customer-management/customer-management.component';
// import { ReportUpManagementComponent } from './report-up-management/report-up-management.component';
import { HttpClientModule } from '@angular/common/http';
//import { AddCustomerComponent } from './customer-management/add-customer/add-customer.component';

import { SharedModule } from './shared-components/shared.module';
import { DigitalPageModule } from './digital/digital.module';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { LoaderColorfullComponent } from './shared-components/loader-colorfull/loader-colorfull.component';

//import { Printer } from '@ionic-native/printer/ngx';
@NgModule({
  declarations: [AppComponent,
    LoaderColorfullComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, SharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, PDFGenerator],
  bootstrap: [AppComponent],
})
export class AppModule { }
