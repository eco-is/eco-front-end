import { Component } from '@angular/core';
import { EducationService } from '../education.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserQuestion } from '../model/userQuestion';
import { TestExecution } from '../model/testExecution';
import { TestCompletionRequest } from '../model/testCompletionRequest';
import { TestCompletionResponse } from '../model/testCompletionResponse';
import { MatSnackBar } from '@angular/material/snack-bar';

type QuestionWithAnswer = UserQuestion & {
  selectedRadio: number;
  selectedCheckbox: boolean[];
  selectedFillIn: string;
};

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.scss'],
})
export class TakeTestComponent {
  questions: QuestionWithAnswer[] = [];

  constructor(
    private service: EducationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.service.startTest(+this.route.snapshot.paramMap.get('id')!).subscribe({
      next: (result: TestExecution) => {
        if (result.finished) {
          this.snackBar.open(
            'You have already earned points for this test. If you retake it you can get results but you cannot earn more points',
            'OK'
          );
        }
        this.service
          .getAllQuestionsByLectureIdForUser(result.lectureId)
          .subscribe({
            next: (results: UserQuestion[]) => {
              this.questions = results.map((question) => ({
                ...question,
                selectedRadio: 0,
                selectedCheckbox: Array<boolean>(question.answers?.length).fill(
                  false
                ),
                selectedFillIn: '',
              }));
            },
          });
      },
      error: () => {
        console.log('Error starting test');
      },
    });
  }

  onFinishTest() {
    let testCompletionRequest: TestCompletionRequest = {
      lectureId: +this.route.snapshot.paramMap.get('id')!,
      answers: [],
    };
    this.questions.forEach((question) => {
      switch (question.type) {
        case 'RADIO':
          testCompletionRequest.answers.push({
            questionId: question.id!,
            answerIds: [question.selectedRadio],
            textAnswer: '',
          });
          break;
        case 'CHECKBOX':
          testCompletionRequest.answers.push({
            questionId: question.id!,
            answerIds: question.answers
              .filter((answer, index) => question.selectedCheckbox[index])
              .map((answer) => answer.id!),
            textAnswer: '',
          });
          break;
        case 'FILL_IN':
          testCompletionRequest.answers.push({
            questionId: question.id!,
            answerIds: [],
            textAnswer: question.selectedFillIn,
          });
      }
    });
    this.service.completeTest(testCompletionRequest).subscribe({
      next: (result: TestCompletionResponse) => {
        this.router.navigate(
          ['rankings', +this.route.snapshot.paramMap.get('id')!],
          { replaceUrl: true }
        );
      },
    });
  }
}
