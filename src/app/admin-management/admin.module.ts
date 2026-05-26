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
import { ReportsTractorComponent } from './reports-tractor/reports-tractor.component';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { MasterSheetsComponent } from './master-sheets/master-sheets.component';
import { PendingReportsComponent } from './pending-reports/pending-reports.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { LeadEmployeeMgmtComponent } from './lead-employee-mgmt/lead-employee-mgmt.component';
import { AddLeadStaffComponent } from './lead-employee-mgmt/add-lead-staff/add-lead-staff.component';
import { AddDistrictInStaffComponent } from './lead-employee-mgmt/add-district-in-staff/add-district-in-staff.component';
import { StoreManagementComponent } from './store-management/store-management.component';
import { AddSalesManagerComponent } from './store-management/add-sales-manager/add-sales-manager.component';
import { TeamManagerComponent } from '../sales-head-department/team-manager/team-manager.component';
import { SalesOfficerComponent } from '../sales-head-department/sales-officer/sales-officer.component';
import { UnsoldTractorListComponent } from './unsold-tractor-list/unsold-tractor-list.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { SpeceficUnsoldTractorListComponent } from './specefic-unsold-tractor-list/specefic-unsold-tractor-list.component';
import { LastActivityComponent } from './last-activity/last-activity.component';
import { DatePipe } from '@angular/common';
import { SalesAnalysisComponent } from './sales-analysis/sales-analysis.component';
import { BufferStockListComponent } from './buffer-stock-list/buffer-stock-list.component';
import { ViewMaintainanceCostComponent } from './view-maintainance-cost/view-maintainance-cost.component';
import { FindingReportsComponent } from './finding-reports/finding-reports.component';
import { NewFindingReportComponent } from './new-finding-report/new-finding-report.component';
import { BookedTractorSheetComponent } from './booked-tractor-sheet/booked-tractor-sheet.component';
@NgModule({
  declarations: [
    FooterAdminComponent,
    DigitalAnalyseComponent,
    AdminManagementComponent,
    ReportsTractorComponent,
    DashboardOverviewComponent,
    MasterSheetsComponent,
    PendingReportsComponent,
    AdminHeaderComponent,
    LeadEmployeeMgmtComponent,
    AddLeadStaffComponent,
    AddDistrictInStaffComponent,
    StoreManagementComponent,
    AddSalesManagerComponent,
    TeamManagerComponent,
    SalesOfficerComponent,
    UnsoldTractorListComponent,
    SalesReportComponent,
    SpeceficUnsoldTractorListComponent,
    LastActivityComponent,
    SalesAnalysisComponent,
    BufferStockListComponent,
    ViewMaintainanceCostComponent,
    FindingReportsComponent,
    NewFindingReportComponent,
    BookedTractorSheetComponent
  ],
  imports: [
   
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AdminRoutingModule ,
    DatePipe
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class AdminModule {}