import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLecturesComponent } from './my-lectures/my-lectures.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowseLecturesComponent } from './browse-lectures/browse-lectures.component';
import { CreateLectureComponent } from './create-lecture/create-lecture.component';
import { MarkdownModule } from 'ngx-markdown';
import { TestCreationModalComponent } from './test-creation-modal/test-creation-modal.component';
import { CreateTestComponent } from './create-test/create-test.component';

@NgModule({
  declarations: [
    MyLecturesComponent,
    BrowseLecturesComponent,
    CreateLectureComponent,
    TestCreationModalComponent,
    CreateTestComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule,
  ],
})
export class EducationModule {}
