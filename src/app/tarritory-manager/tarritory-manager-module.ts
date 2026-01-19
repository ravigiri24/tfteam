


  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';


import { SharedModule } from '../shared-components/shared.module';

import { FilterPipeModule } from 'ngx-filter-pipe';

// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TarritoryManagerComponent } from './tarritory-manager.component';
import { TarritoryRoutingModule } from './tarritory-manager-routing';
import { TarritoryManagerApprovalListComponent } from './tarritory-manager-approval-list/tarritory-manager-approval-list.component';
import { TarritoryManagerTractorListComponent } from './tarritory-manager-tractor-list/tarritory-manager-tractor-list.component';
import { EnquiryListTarritoryManagerComponent } from './enquiry-list-tarritory-manager/enquiry-list-tarritory-manager.component';
import { TarritoryManagerFooterComponent } from './tarritory-manager-footer/tarritory-manager-footer.component';
@NgModule({
  declarations: [
TarritoryManagerComponent,
TarritoryManagerApprovalListComponent,
TarritoryManagerTractorListComponent,
EnquiryListTarritoryManagerComponent,
TarritoryManagerFooterComponent

    
  ],
  imports: [
  
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    TarritoryRoutingModule
    
    
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },PDFGenerator,InAppBrowser],
})
  export class TarritoryManagerModule {}