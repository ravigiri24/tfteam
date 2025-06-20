import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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
    ViewListComponent
    
  ],
  schemas: [],
  exports: [
    AddRemarkComponent,
    UserManagementComponent,
    SearchpipePipe,
    CrudPopupComponent,
    ViewListComponent
  ],
  providers: [ApiService],
})
export class SharedModule {}
