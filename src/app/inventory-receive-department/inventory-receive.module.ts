import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared-components/shared.module';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { InventoryReceiveDepartmentComponent } from './inventory-receive-department.component';
import { InventoryReceiveRoutingModule } from './inventory-receive-routing';
import { InventoryFooterComponent } from './inventory-footer/inventory-footer.component';
import { InventoryReceivedListComponent } from './inventory-received-list/inventory-received-list.component';
@NgModule({
  declarations: [
  InventoryReceiveDepartmentComponent,
  InventoryFooterComponent,
  InventoryReceivedListComponent
  ],
  imports: [
        CommonModule,
        InventoryReceiveRoutingModule,
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        FilterPipeModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },InAppBrowser],
})
export class InventoryReceiveModule {}