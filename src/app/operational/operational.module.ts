import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { OperationlPageRoutingModule } from './operational-routing.module';
import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';
import { BasicInfoComponent } from '../shared-components/basic-info/basic-info.component';
import { PurchaseDetailsComponent } from '../shared-components/purchase-details/purchase-details.component';
// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { OperationalComponent } from './operational.component';
import { HeaderOperationComponent } from './header-operation/header-operation.component';
import { FooterOperationComponent } from './footer-operation/footer-operation.component';
import { AddNewArrivalsComponent } from '../new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
@NgModule({
  declarations: [OperationalComponent,HeaderOperationComponent,FooterOperationComponent,NewArrivalsManagementComponent,AddNewArrivalsComponent,SelectBrandComponent,BasicInfoComponent,PurchaseDetailsComponent],
  imports: [OperationlPageRoutingModule,CommonModule, IonicModule.forRoot(),FormsModule,ReactiveFormsModule,HttpClientModule,SharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

})
  export class OperationlPageModule {}