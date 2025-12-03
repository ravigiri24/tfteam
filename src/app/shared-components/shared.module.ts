import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { ApiService } from '../api.service';
import { SelectRoleComponent } from '../user-management/select-role/select-role.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SearchpipePipe } from '../searchpipe.pipe';
import { CrudPopupComponent } from './crud-popup/crud-popup.component';
import { TractorCostingListComponent } from './tractor-costing-list/tractor-costing-list.component';
import { TractorCostingDashboardComponent } from './tractor-costing-dashboard/tractor-costing-dashboard.component';
import { ViewTractorDetailsComponent } from './view-tractor-details/view-tractor-details.component';
import { ViewTransactionDetailsComponent } from './view-transaction-details/view-transaction-details.component';
import { SelectWithSearchComponent } from './select-with-search/select-with-search.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SyncTractorWithMaintaninanceComponent } from './sync-tractor-with-maintaninance/sync-tractor-with-maintaninance.component';
import { SearchTractorWithTfCodeComponent } from './search-tractor-with-tf-code/search-tractor-with-tf-code.component';
import { SelectListTypeComponent } from './select-list-type/select-list-type.component';
import { TractorShowAllDataComponent } from './tractor-show-all-data/tractor-show-all-data.component';
import { PurchaseCarfComponent } from './purchase-carf/purchase-carf.component';
import { ViewListComponent } from './view-list/view-list.component';
import { NocUpdateComponent } from '../rto-management/rto-noc/noc-update/noc-update.component';
import { RtoDetailsFormComponent } from '../rto-management/rto-details-form/rto-details-form.component';
import { DocsOptionsComponent } from '../rto-management/rto-sold-process/docs-options/docs-options.component';
import { RtoDocsDetailsComponent } from '../rto-management/rto-docs-details/rto-docs-details.component';
import { RtoOptionsComponent } from '../rto-management/rto-options/rto-options.component';
import { CommonOptionsPlatformComponent } from './common-options-platform/common-options-platform.component';
import { SingleImageShowComponent } from '../maintainance-management/single-image-show/single-image-show.component';
import { ShowSalesDetailsComponent } from '../finance-department/show-sales-details/show-sales-details.component';
import { FinanceDetailsComponent } from '../rto-management/rto-docs-details/finance-details/finance-details.component';
import { RcUpdateComponent } from './rc-update/rc-update.component';
import { NewArrivalsManagementComponent } from 'src/app/new-arrivals-management/new-arrivals-management.component';
import { DeleteTractorComponent } from './delete-tractor/delete-tractor.component';
import { AddRtoInsuranceCostComponent } from './add-rto-insurance-cost/add-rto-insurance-cost.component';
import { ViewTractorDocsStatusRtoComponent } from '../rto-management/tractor-doc-status/view-tractor-docs-status-rto/view-tractor-docs-status-rto.component';
import { AddTractorDocsStatusRtoComponent } from '../rto-management/tractor-doc-status/add-tractor-docs-status-rto/add-tractor-docs-status-rto.component';
import { NoDataViewComponent } from './no-data-view/no-data-view.component';
import { ExistTractorAlertComponent } from './exist-tractor-alert/exist-tractor-alert.component';
import { UpdateVersionAlertComponent } from './update-version-alert/update-version-alert.component';
import { TractorPriceFranchiseComponent } from '../franchise-operations-department/tractor-price-franchise/tractor-price-franchise.component';
import { CustomerListingComponent } from './customer-listing/customer-listing.component';
import { HeadListingComponent } from './head-listing/head-listing.component';
import { AddCityComponent } from './district-management/add-city/add-city.component';
import { ViewCustomerListComponent } from './view-customer-list/view-customer-list.component';
import { ReviewPageComponent } from '../customer-management/review-page/review-page.component';
import { ViewCustomerDataComponent } from '../customer-management/view-customer-data/view-customer-data.component';
import { ViewStaffListComponent } from './view-staff-list/view-staff-list.component';
import { CommonHeaderComponent } from './common-header/common-header.component';
import { SelectCityModelComponent } from './select-city-model/select-city-model.component';
import { SelectDistrictModelComponent } from './select-district-model/select-district-model.component';
import { UpdatePasswordComponent } from '../user-management/update-password/update-password.component';
import { TfCodeBackDatedComponent } from '../operational/tf-code-back-dated/tf-code-back-dated.component';
import { SellBackComponent } from './sell-back/sell-back.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchPipe } from '../search.pipe';
import { GlobalFilterTractorComponent } from './global-filter-tractor/global-filter-tractor.component';
import { ReceiveTractorImageComponent } from '../sales-officer-depart/receive-tractor-image/receive-tractor-image.component';
import { EnquireCustomerListComponent } from './enquire-customer-list/enquire-customer-list.component';
import { NotificationPopUpComponent } from './notification-pop-up/notification-pop-up.component';
import { ViewEnquiryComponent } from '../sales-officer-depart/view-enquiry/view-enquiry.component';
import { TeamManagerComponent } from './team-manager/team-manager.component';
import { AddTeamManagerComponent } from './team-manager/add-team-manager/add-team-manager.component';
import { AssigningStaffComponent } from './assigning-staff/assigning-staff.component';
import { SelectStoreComponent } from '../user-management/select-store/select-store.component';
import { VisitingManagementComponent } from '../visiting-management/visiting-management.component';
import { FollowUpManagementComponent } from '../follow-up-management/follow-up-management.component';
import { ViewAppovalsListComponent } from './view-appovals-list/view-appovals-list.component';
import { AllotStoreComponent } from './allot-store/allot-store.component';
import { SelectRepairCenterComponent } from '../user-management/select-repair-center/select-repair-center.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SearchPipe,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FilterPipeModule,

    IonicModule.forRoot({}),
  ],
  declarations: [
    CommonHeaderComponent,
    AddRemarkComponent,
    UserManagementComponent,
    SearchpipePipe,
    CrudPopupComponent,
    TractorCostingListComponent,
    TractorCostingDashboardComponent,
    ViewTractorDetailsComponent,
    ViewTransactionDetailsComponent,
    SelectWithSearchComponent,
    SyncTractorWithMaintaninanceComponent,
    SearchTractorWithTfCodeComponent,
    SelectListTypeComponent,
    SelectRoleComponent,
    TractorShowAllDataComponent,
    PurchaseCarfComponent,
    ViewListComponent,
    NocUpdateComponent,
    RtoDetailsFormComponent,
    DocsOptionsComponent,
    RtoDocsDetailsComponent,
    RtoOptionsComponent,
    CommonOptionsPlatformComponent,
    SingleImageShowComponent,
    ShowSalesDetailsComponent,
    FinanceDetailsComponent,
    RcUpdateComponent,
    NewArrivalsManagementComponent,
    DeleteTractorComponent,
    AddRtoInsuranceCostComponent,
    ViewTractorDocsStatusRtoComponent,
    AddTractorDocsStatusRtoComponent,
    NoDataViewComponent,
    ExistTractorAlertComponent,
    UpdateVersionAlertComponent,
    TractorPriceFranchiseComponent,
    CustomerListingComponent,
    HeadListingComponent,
    AddCityComponent,
    ViewCustomerListComponent,
    ReviewPageComponent,
    ViewCustomerDataComponent,
    ViewStaffListComponent,

    SelectCityModelComponent,
    SelectDistrictModelComponent,
    UpdatePasswordComponent,
    GlobalFilterTractorComponent,
    TfCodeBackDatedComponent,
    SellBackComponent,
    ImageSliderComponent,
    ReceiveTractorImageComponent,
    EnquireCustomerListComponent,
    NotificationPopUpComponent,
    ViewEnquiryComponent,
    TeamManagerComponent,
    AddTeamManagerComponent,
    AssigningStaffComponent,
    SelectStoreComponent,
    VisitingManagementComponent,
    FollowUpManagementComponent,
    ViewAppovalsListComponent ,
    AllotStoreComponent,
    SelectRepairCenterComponent
    
  ],

  exports: [
    AddRemarkComponent,
    UserManagementComponent,
    SearchpipePipe,
    CrudPopupComponent,
    ViewListComponent,
    SearchTractorWithTfCodeComponent,
    NoDataViewComponent,
    CustomerListingComponent,
    HeadListingComponent,
    ViewCustomerListComponent,
    ViewStaffListComponent,
    CommonHeaderComponent,
    EnquireCustomerListComponent,
    TeamManagerComponent,
    VisitingManagementComponent,
    FollowUpManagementComponent
   
  ],
  providers: [ApiService, InAppBrowser,],
})
export class SharedModule { }
