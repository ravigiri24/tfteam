import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';

// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { PurchaseManagementComponent } from './purchase-management.component';
import { PurchaseFooterComponent } from './purchase-footer/purchase-footer.component';
import { NewFindingsComponent } from './new-findings/new-findings.component';
@NgModule({
  declarations: [

    PurchaseManagementComponent,

    
    PurchaseFooterComponent,
    NewFindingsComponent
  ],
  imports: [
    PurchaseRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class PurchaseManagementModule {}
