import { Component } from '@angular/core';
import { EducatorQuestion } from '../model/educatorQuestion';
import { EducationService } from '../education.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss'],
})
export class TestDetailsComponent {
  questions: EducatorQuestion[] = [];

  constructor(
    private service: EducationService,
    private route: ActivatedRoute
  ) {
    this.service
      .getAllQuestionsByLectureIdForEducator(
        +this.route.snapshot.paramMap.get('id')!
      )
      .subscribe({
        next: (results: EducatorQuestion[]) => {
          this.questions = results;
        },
      });
  }

  getIndexOfCorrectAnswer(question: EducatorQuestion) {
    return question.answers.findIndex((ans) => ans.isCorrect);
  }
}
