import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginPageRoutingModule } from './login.routing.module';
import { ApiService } from '../api.service';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
   
    LoginPageRoutingModule,
    IonicModule.forRoot({})
  ],
  declarations: [LoginComponent],
  schemas: [],
  exports: [],
providers:[ApiService]
})
export class LoginPageModule {}