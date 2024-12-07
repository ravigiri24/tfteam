import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { ApiService } from '../api.service';
@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      IonicModule,
 
      IonicModule.forRoot({})
    ],
    declarations: [AddRemarkComponent],
    schemas: [],
    exports: [AddRemarkComponent],
  providers:[ApiService]
  })
  export class SharedModule {}