import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { FranchiseRoutingModule } from './franchise-routing.module';
import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';

// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { FranchiseManagementComponent } from './franchise-management.component';
import { NewTractorComponent } from './new-tractor/new-tractor.component';
import { FranchiseFooterComponent } from './franchise-footer/franchise-footer.component';
import { StoreTractorComponent } from './store-tractor/store-tractor.component';
import { StoreTansactionComponent } from './store-tansaction/store-tansaction.component';
import { FranchiseTractorDashboardComponent } from './franchise-tractor-dashboard/franchise-tractor-dashboard.component';
@NgModule({
  declarations: [

      FranchiseManagementComponent,
    NewTractorComponent,
    FranchiseFooterComponent,
    StoreTractorComponent,
    StoreTansactionComponent,
    FranchiseTractorDashboardComponent

  ],
  imports: [
    FranchiseRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class FranchiseManagementModule {}
