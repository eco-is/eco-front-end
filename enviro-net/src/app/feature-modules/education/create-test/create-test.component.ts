import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EducatorQuestion } from '../model/educatorQuestion';
import { ActivatedRoute, Router } from '@angular/router';
import { EducatorAnswer } from '../model/educatorAnswer';
import { EducationService } from '../education.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss'],
})
export class CreateTestComponent {
  answerControls: FormControl[] = [];
  questionControl = new FormControl('', [Validators.required]);
  answersNumber: number = 2;
  selectedRadioAnswer: number | null = null;
  questions: EducatorQuestion[] = [];
  totalQuestions: number = 0;
  currentlyCreating: 'RADIO' | 'CHECKBOX' | 'FILL_IN' | 'NONE' = 'NONE';
  checkboxStates: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: EducationService,
    private router: Router
  ) {
    this.generateAnswerRange(this.answersNumber).forEach((el) => {
      this.answerControls[el] = new FormControl('', [Validators.required]);
      this.checkboxStates[el] = false;
    });
  }

  generateAnswerRange(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i);
  }

  onAddRadioAnswer() {
    this.answerControls.push(new FormControl('', [Validators.required]));
    this.answersNumber++;
  }

  onRemoveRadioAnswer(index: number) {
    this.answerControls.splice(index, 1);
    if (index === this.selectedRadioAnswer) {
      this.selectedRadioAnswer = null;
    }
    this.answersNumber--;
  }

  onAddCheckboxAnswer() {
    this.answerControls.push(new FormControl('', [Validators.required]));
    if (this.checkboxStates.length == this.answersNumber) {
      this.checkboxStates.push(false);
    }
    this.answersNumber++;
  }

  onRemoveCheckboxAnswer(index: number) {
    this.answerControls.splice(index, 1);
    this.checkboxStates.splice(index, 1);
    this.answersNumber--;
  }

  onFinishRadioQuestion() {
    let answers: EducatorAnswer[] = this.generateAnswerRange(
      this.answersNumber
    ).map((el) => {
      return {
        content: this.answerControls[el].value,
        isCorrect: el === this.selectedRadioAnswer,
      } as EducatorAnswer;
    });
    let newQuestion: EducatorQuestion = {
      orderInLecture: this.totalQuestions,
      lectureId: +this.route.snapshot.paramMap.get('id')!,
      content: this.questionControl.value!,
      type: 'RADIO',
      answers,
    };
    this.questions.push(newQuestion);
    this.totalQuestions++;

    this._cleanupQuestion();
    this.currentlyCreating = 'NONE';
  }

  onFinishCheckboxQuestion() {
    let answers: EducatorAnswer[] = this.generateAnswerRange(
      this.answersNumber
    ).map((el) => {
      return {
        content: this.answerControls[el].value,
        isCorrect: this.checkboxStates[el],
      } as EducatorAnswer;
    });
    let newQuestion: EducatorQuestion = {
      orderInLecture: this.totalQuestions,
      lectureId: +this.route.snapshot.paramMap.get('id')!,
      content: this.questionControl.value!,
      type: 'CHECKBOX',
      answers,
    };
    this.questions.push(newQuestion);
    this.totalQuestions++;

    this._cleanupQuestion();
    this.currentlyCreating = 'NONE';
  }

  onFinishFillInQuestion() {
    let newQuestion: EducatorQuestion = {
      orderInLecture: this.totalQuestions,
      lectureId: +this.route.snapshot.paramMap.get('id')!,
      content: this.questionControl.value!,
      type: 'FILL_IN',
      answers: [{ content: this.answerControls[0].value, isCorrect: true }],
    };
    this.questions.push(newQuestion);
    this.totalQuestions++;

    this._cleanupQuestion();
    this.currentlyCreating = 'NONE';
  }

  private _cleanupQuestion() {
    this.questionControl.setValue('');
    this.questionControl.markAsUntouched();
    this.answerControls = [];
    this.answersNumber = 2;
    this.selectedRadioAnswer = null;
    this.checkboxStates = [false, false];
  }

  canFinishRadioQuestion(): boolean {
    return (
      !!this.questionControl.value &&
      this.answerControls.every((el) => !!el.value) &&
      this.selectedRadioAnswer !== null
    );
  }

  canFinishCheckboxQuestion(): boolean {
    return (
      !!this.questionControl.value &&
      this.answerControls.every((el) => !!el.value) &&
      this.checkboxStates.filter((el) => el).length > 0 &&
      this.checkboxStates.filter((el) => !el).length > 0
    );
  }

  canFinishFillInQuestion(): boolean {
    return !!this.questionControl.value && this.answerControls[0].value;
  }

  onCancelCreation() {
    this._cleanupQuestion();
    this.currentlyCreating = 'NONE';
  }

  onStartRadioCreation() {
    this.generateAnswerRange(this.answersNumber).forEach((el) => {
      this.answerControls[el] = new FormControl('', [Validators.required]);
    });

    this.currentlyCreating = 'RADIO';
  }

  onStartCheckboxCreation() {
    this.generateAnswerRange(this.answersNumber).forEach((el) => {
      this.answerControls[el] = new FormControl('', [Validators.required]);
    });

    this.currentlyCreating = 'CHECKBOX';
  }

  onStartFillInCreation() {
    this.answerControls[0] = new FormControl('', [Validators.required]);

    this.currentlyCreating = 'FILL_IN';
  }

  getIndexOfCorrectAnswer(question: EducatorQuestion) {
    return question.answers.findIndex((ans) => ans.isCorrect);
  }

  onSaveTest() {
    forkJoin(
      this.questions.map((question) => {
        return this.service.createQuestion(question);
      })
    ).subscribe({
      next: (results: EducatorQuestion[]) => {
        this.router.navigate(['my-lectures']);
      },
    });
  }
}
