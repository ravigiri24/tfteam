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
import { AddNewFindingsComponent } from './new-findings/add-new-findings/add-new-findings.component'
import { CostPredictionComponent } from './cost-prediction/cost-prediction.component';
import { StorePaymentTransactionComponent } from './store-payment-transaction/store-payment-transaction.component';
import { TransactionHistoryComponent } from './store-payment-transaction/transaction-history/transaction-history.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AddDealerPriceComponent } from './add-dealer-price/add-dealer-price.component';
import { ViewTransactionDetailsComponent } from './view-transaction-details/view-transaction-details.component';
@NgModule({
  declarations: [

    PurchaseManagementComponent,

    
    PurchaseFooterComponent,
    NewFindingsComponent,
    AddNewFindingsComponent,
    CostPredictionComponent,
    StorePaymentTransactionComponent,
    TransactionHistoryComponent,
    AddTransactionComponent,
    AddDealerPriceComponent,
    ViewTransactionDetailsComponent
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
