import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { TransportManagementComponent } from './transport-management.component';
import { TransportDepartmentComponent } from './transport-department/transport-department.component';
//import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';

// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { TransportRoutingModule } from './transport-routing.module';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { TransportFooterComponent } from './transport-footer/transport-footer.component';
import { AddCostComponent } from './add-cost/add-cost.component';
import { TransportOptionsComponent } from './transport-options/transport-options.component';
import { TransportActualDateFormComponent } from './transport-actual-date-form/transport-actual-date-form.component';

@NgModule({
  declarations: [

  //  SelectBrandComponent,
    TransportManagementComponent,
    TransportDepartmentComponent,
    TransportFooterComponent,
    AddCostComponent,
    TransportOptionsComponent,
    TransportActualDateFormComponent
 
  ],
  imports: [
    
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    TransportRoutingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class TransportModule {}
