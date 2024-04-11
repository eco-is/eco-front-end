import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
//import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
// import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    // LoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule
  ],
  exports: [
    // LoginComponent
  ]
})
export class AuthModule { }
