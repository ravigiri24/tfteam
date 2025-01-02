import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';
import { FooterAdminComponent } from './footer-admin/footer-admin.component';
import { DigitalAnalyseComponent } from './digital-analyse/digital-analyse.component';
import { AdminManagementComponent } from './admin-management.component';
import { AdminRoutingModule } from './admin-routing.module';
@NgModule({
  declarations: [
    FooterAdminComponent,
    DigitalAnalyseComponent,
    AdminManagementComponent
  ],
  imports: [
   
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AdminRoutingModule 
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class AdminModule {}