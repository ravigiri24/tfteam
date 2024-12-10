import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { ApiService } from '../api.service';
import { UserManagementComponent } from '../user-management/user-management.component';

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      IonicModule,
     IonicModule.forRoot({})
    ],
    declarations: [AddRemarkComponent,UserManagementComponent],
    schemas: [],
    exports: [AddRemarkComponent,UserManagementComponent],
  providers:[ApiService]
  })
  export class SharedModule {}