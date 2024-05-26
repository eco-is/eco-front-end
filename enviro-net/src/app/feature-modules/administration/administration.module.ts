import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MemberRegistrationFormComponent } from './member-registration-form/member-registration-form.component';
import { MemberVerificationFormComponent } from './member-verification-form/member-verification-form.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MemberRegistrationFormComponent,
    MemberVerificationFormComponent,
    MyProfileComponent,
    EditProfileComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    RouterModule,
    MatBadgeModule,
  ]
})
export class AdministrationModule { }
