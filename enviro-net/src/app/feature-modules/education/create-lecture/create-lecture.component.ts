import { Component, OnInit } from '@angular/core';
import { Lecture } from '../model/lecture';
import { EducationService } from '../education.service';
import { Category } from '../model/category';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { LectureCreationRequest } from '../model/lectureCreationRequest';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TestCreationModalComponent } from '../test-creation-modal/test-creation-modal.component';

@Component({
  selector: 'app-create-lecture',
  templateUrl: './create-lecture.component.html',
  styleUrls: ['./create-lecture.component.scss'],
})
export class CreateLectureComponent implements OnInit {
  user: User | undefined;
  lecture: Lecture | null = null;
  allCategories: string[] = [];
  name: string = '';
  selectedCategories: string[] = [];
  unselectedCategories: string[] = [];
  selectedMinAge: number | null = null;
  selectedMaxAge: number | null = null;
  selectedDifficulty: string = '';
  content: string = '';
  nameField = new FormControl('', [Validators.required]);
  minAgeField = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(150),
  ]);
  maxAgeField = new FormControl('', [
    Validators.required,
    Validators.min(this.selectedMinAge ?? 0),
    Validators.max(150),
  ]);
  difficultyField = new FormControl('', [Validators.required]);
  contentField = new FormControl('', [Validators.required]);

  constructor(
    private service: EducationService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.minAgeValidator = this.minAgeValidator.bind(this);
    this.maxAgeValidator = this.maxAgeValidator.bind(this);
  }

  ngOnInit(): void {
    this.minAgeField.addValidators([this.minAgeValidator]);
    this.maxAgeField.addValidators([this.maxAgeValidator]);

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    this.service.getAllCategories().subscribe({
      next: (result: Category[]) => {
        this.allCategories = result.map((cat) => cat.description);
        this.unselectedCategories = this.allCategories;
      },
      error: () => {},
    });
  }

  updateCategories(categories: string[]) {
    this.selectedCategories = categories;
    this.unselectedCategories = this.allCategories.filter((cat) => {
      return this.selectedCategories.indexOf(cat) < 0;
    });
  }

  getNameErrorMessage() {
    if (this.nameField.hasError('required')) {
      return 'Cannot be empty';
    }
    return null;
  }

  getAgeErrorMessage() {
    if (this.minAgeField.hasError('required')) {
      return 'Cannot be empty';
    }
    if (this.minAgeField.hasError('min')) {
      return 'Cannot be less than 0';
    }
    if (this.minAgeField.hasError('max')) {
      return 'Cannot be more than 150';
    }
    if (
      this.minAgeField.hasError('invalidRange') ||
      this.maxAgeField.hasError('invalidRange')
    ) {
      return 'Invalid age range';
    }
    return null;
  }

  getDifficultyErrorMessage() {
    if (this.difficultyField.hasError('required')) {
      return 'Must select difficlty';
    }
    return null;
  }

  getContentErrorMessage() {
    if (this.contentField.hasError('required')) {
      return 'Must not be empty';
    }
    return null;
  }

  minAgeValidator(control: AbstractControl) {
    if (
      this.selectedMaxAge !== null &&
      this.selectedMaxAge !== undefined &&
      control.value > this.selectedMaxAge
    ) {
      return { invalidRange: true };
    }
    return null;
  }

  maxAgeValidator(control: AbstractControl) {
    if (
      this.selectedMinAge !== null &&
      this.selectedMinAge !== undefined &&
      control.value < this.selectedMinAge
    ) {
      console.log('control', control);
      return { invalidRange: true };
    }
    return null;
  }

  onCreate() {
    let lecture: LectureCreationRequest = {
      name: this.name,
      content: this.content,
      difficulty: this.selectedDifficulty.toUpperCase(),
      minRecommendedAge: this.selectedMinAge!,
      maxRecommendedAge: this.selectedMaxAge!,
      categories: this.selectedCategories,
      creatorId: this.user!.id,
    };
    this.service.createLecture(lecture).subscribe({
      next: (result: Lecture) => {
        this.openDialog('250ms', '250ms', result.id);
      },
    });
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    lectureId: number
  ): void {
    this.dialog.open(TestCreationModalComponent, {
      width: '450px',
      height: '200px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        lectureId,
      },
    });
  }
}
