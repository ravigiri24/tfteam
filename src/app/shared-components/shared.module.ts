import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { ApiService } from '../api.service';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SearchpipePipe } from '../searchpipe.pipe';
import { CrudPopupComponent } from './crud-popup/crud-popup.component';
import { TractorCostingListComponent } from './tractor-costing-list/tractor-costing-list.component';
import { TractorCostingDashboardComponent } from './tractor-costing-dashboard/tractor-costing-dashboard.component';
import { ViewTractorDetailsComponent } from './view-tractor-details/view-tractor-details.component';
import { ViewTransactionDetailsComponent } from './view-transaction-details/view-transaction-details.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    
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
    ViewTransactionDetailsComponent
    
  ],
  schemas: [],
  exports: [
    AddRemarkComponent,
    UserManagementComponent,
    SearchpipePipe,
    CrudPopupComponent,
  ],
  providers: [ApiService],
})
export class SharedModule {}
