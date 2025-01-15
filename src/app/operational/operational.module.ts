import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TransportManagementComponent } from '../transport-management/transport-management.component';
import { AddNewArrivalsComponent } from '../new-arrivals-management/add-new-arrivals/add-new-arrivals.component';
import { NewArrivalsManagementComponent } from '../new-arrivals-management/new-arrivals-management.component';
import { TransportCostListComponent } from '../transport-management/transport-cost-list/transport-cost-list.component';
import { AddCostComponent } from '../transport-management/add-cost/add-cost.component';
import { AddTransportStatusComponent } from '../transport-management/add-transport-status/add-transport-status.component';
import { ConfirmDeliveryComponent } from '../transport-management/confirm-delivery/confirm-delivery.component';
import { MaintainanceManagementComponent } from '../maintainance-management/maintainance-management.component';
import { ImageViewerComponent } from '../maintainance-management/image-viewer/image-viewer.component';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import { RepairTractorDashboardComponent } from '../maintainance-management/repair-tractor-dashboard/repair-tractor-dashboard.component';
import { MaterialListComponent } from '../maintainance-management/material-list/material-list.component';
import { AddMaterialComponent } from '../maintainance-management/add-material/add-material.component';
import { AddServiceChargeComponent } from '../maintainance-management/add-service-charge/add-service-charge.component';
import { AddRepairStatusComponent } from '../maintainance-management/add-repair-status/add-repair-status.component';
import { StartTransportDialogComponent } from '../transport-management/start-transport-dialog/start-transport-dialog.component';
import { StartRepairDialogComponent } from '../transport-management/start-repair-dialog/start-repair-dialog.component';
import { FinishRepairDialogComponent } from '../maintainance-management/finish-repair-dialog/finish-repair-dialog.component';
import { AllTractorListComponent } from '../all-tractor-list/all-tractor-list.component';
import { TractorDashboardComponent } from '../shared-components/tractor-dashboard/tractor-dashboard.component';
import { AddMaunalChargeComponent } from '../maintainance-management/add-maunal-charge/add-maunal-charge.component';
import { ImageDashboardComponent } from '../maintainance-management/image-dashboard/image-dashboard.component';
import { TractorSellsDetailsComponent } from '../tractor-sells-details/tractor-sells-details.component';
import { TractorFinanceDetailsComponent } from '../tractor-finance-details/tractor-finance-details.component';
import { SellDocumentComponent } from '../sell-document/sell-document.component';
import { OtherExpenseListComponent } from '../tractor-dashboard/other-expense-list/other-expense-list.component'
import { AddOtherExpenseComponent } from '../tractor-dashboard/add-other-expense/add-other-expense.component';
@NgModule({
  declarations: [
    OperationalComponent,
    HeaderOperationComponent,
    FooterOperationComponent,
    NewArrivalsManagementComponent,
    AddNewArrivalsComponent,
    SelectBrandComponent,
    BasicInfoComponent,
    PurchaseDetailsComponent,
    TransportManagementComponent,
    TransportCostListComponent,
    AddCostComponent,
    AddTransportStatusComponent,
    ConfirmDeliveryComponent,
    MaintainanceManagementComponent,
    ImageViewerComponent,
    SingleImageShowComponent,
    RepairTractorDashboardComponent,
    MaterialListComponent,
    AddMaterialComponent,
    AddServiceChargeComponent,
    AddRepairStatusComponent,
    StartTransportDialogComponent,
    StartRepairDialogComponent,
    FinishRepairDialogComponent,
    AllTractorListComponent,
    TractorDashboardComponent,
    AddMaunalChargeComponent,
    ImageDashboardComponent,
    TractorSellsDetailsComponent,
    TractorFinanceDetailsComponent,
    SellDocumentComponent,
    OtherExpenseListComponent,
    AddOtherExpenseComponent
  ],
  imports: [
    OperationlPageRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class OperationlPageModule {}
