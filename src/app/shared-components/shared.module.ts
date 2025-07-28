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

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FilterPipeModule,
    
    IonicModule.forRoot({}),
  ],
  declarations: [
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
    DeleteTractorComponent
    
  ],
  schemas: [],
  exports: [
    AddRemarkComponent,
    UserManagementComponent,
    SearchpipePipe,
    CrudPopupComponent,
    ViewListComponent,
    SearchTractorWithTfCodeComponent
  ],
  providers: [ApiService,    InAppBrowser,],
})
export class SharedModule {}
