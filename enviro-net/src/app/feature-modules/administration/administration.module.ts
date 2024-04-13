import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';



@NgModule({
  declarations: [
    MyProfileComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    RouterModule,
  ]
})
export class AdministrationModule { }
