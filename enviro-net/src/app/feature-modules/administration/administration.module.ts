import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberRegistrationFormComponent } from './member-registration-form/member-registration-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MemberVerificationFormComponent } from './member-verification-form/member-verification-form.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MemberRegistrationFormComponent,
    MemberVerificationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class AdministrationModule { }
