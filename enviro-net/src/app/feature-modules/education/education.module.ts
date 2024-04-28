import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLecturesComponent } from './my-lectures/my-lectures.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowseLecturesComponent } from './browse-lectures/browse-lectures.component';

@NgModule({
  declarations: [MyLecturesComponent, BrowseLecturesComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class EducationModule {}
