import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginPageRoutingModule } from './login.routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    IonicModule.forRoot({})
  ],
  declarations: [LoginComponent],
  schemas: [],
  exports: []

})
export class LoginPageModule {}