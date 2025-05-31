import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { FranchiseOerationDeparmentRoutingModule } from './franchise-operation-routing.module';
import { SelectBrandComponent } from '../shared-components/select-brand/select-brand.component';

// import { SearchpipePipe } from '../searchpipe.pipe';
import { SharedModule } from '../shared-components/shared.module';
import { FranchiseOperationFooterComponent } from './franchise-operation-footer/franchise-operation-footer.component';
import { FranchiseOperationsDepartmentComponent } from './franchise-operations-department.component';
import { ReadyTractorListSalesComponent } from './ready-tractor-list-sales/ready-tractor-list-sales.component';
import { FranchiseOperationHeaderComponent } from './franchise-operation-header/franchise-operation-header.component';
import { TracotorListDisplayComponent } from './tracotor-list-display/tracotor-list-display.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TracotorSettingsComponent } from './tracotor-settings/tracotor-settings.component';
@NgModule({
  declarations: [
FranchiseOperationFooterComponent,

FranchiseOperationsDepartmentComponent,
ReadyTractorListSalesComponent,
FranchiseOperationHeaderComponent,
TracotorListDisplayComponent,
TracotorSettingsComponent
  ],
  imports: [
    FranchiseOerationDeparmentRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class FranchiseOperationDepartmentModule {}
