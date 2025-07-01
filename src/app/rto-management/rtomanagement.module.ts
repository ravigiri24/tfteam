


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
import { RtoManagementComponent } from './rto-management.component';
import { RtoRoutingModule } from './rto-routing';
import { RtoFooterComponent } from './rto-footer/rto-footer.component';
import { RtoNocComponent } from './rto-noc/rto-noc.component';
import { RtoSoldProcessComponent } from './rto-sold-process/rto-sold-process.component';
import { NocUpdateComponent } from './rto-noc/noc-update/noc-update.component';
import { NocViewOptionsComponent } from './rto-noc/noc-view-options/noc-view-options.component';
import { RtoOptionsComponent } from './rto-options/rto-options.component';
import { RtoDetailsFormComponent } from './rto-details-form/rto-details-form.component';
import { DocsOptionsComponent } from './rto-sold-process/docs-options/docs-options.component';
import { RtoDocsDetailsComponent } from './rto-docs-details/rto-docs-details.component';
import { FinanceDetailsComponent } from './rto-docs-details/finance-details/finance-details.component';
import { SearchRtoNocComponent } from './rto-noc/search-rto-noc/search-rto-noc.component';
@NgModule({
  declarations: [
  RtoManagementComponent,
 RtoSoldProcessComponent,
 RtoFooterComponent,
 RtoNocComponent,
 NocUpdateComponent,
 NocViewOptionsComponent,
 RtoOptionsComponent,
 RtoDetailsFormComponent,
 DocsOptionsComponent,
 RtoDocsDetailsComponent,
 FinanceDetailsComponent,
 SearchRtoNocComponent
    
  ],
  imports: [
    RtoRoutingModule,
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FilterPipeModule,
    
    
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },PDFGenerator,InAppBrowser],
})
  export class RtoModule {}