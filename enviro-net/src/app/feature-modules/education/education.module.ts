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
import { LectureDetailsComponent } from './lecture-details/lecture-details.component';
import { TestDetailsComponent } from './test-details/test-details.component';
import { TakeTestComponent } from './take-test/take-test.component';
import { RankingsComponent } from './rankings/rankings.component';
import { GlobalRankingsComponent } from './global-rankings/global-rankings.component';

@NgModule({
  declarations: [
    MyLecturesComponent,
    BrowseLecturesComponent,
    CreateLectureComponent,
    TestCreationModalComponent,
    CreateTestComponent,
    LectureDetailsComponent,
    TestDetailsComponent,
    TakeTestComponent,
    RankingsComponent,
    GlobalRankingsComponent,
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
