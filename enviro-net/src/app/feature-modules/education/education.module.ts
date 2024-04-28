import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLecturesComponent } from './my-lectures/my-lectures.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyLecturesComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class EducationModule {}
