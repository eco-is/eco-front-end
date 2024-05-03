import { Component, OnInit } from '@angular/core';
import { Lecture } from '../model/lecture';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { EducationService } from '../education.service';
import { Category } from '../model/category';
import { LectureForTable } from '../model/lectureForTable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-lectures',
  templateUrl: './my-lectures.component.html',
  styleUrls: ['./my-lectures.component.scss'],
})
export class MyLecturesComponent implements OnInit {
  user: User | undefined;
  lectures: Lecture[] = [];
  lecturesForDisplay: LectureForTable[] = [];
  filteredLectures: Lecture[] = [];
  displayedColumns: string[] = ['id', 'name', 'difficulty', 'age'];
  allCategories: string[] = [];
  selectedCategories: string[] = [];
  unselectedCategories: string[] = [];
  searchText: string = '';
  selectedAge: number | null = null;
  selectedDifficulty: string = '';

  constructor(
    private authService: AuthService,
    private service: EducationService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    this.service.getAllLecturesByCreatorId(this.user!.id).subscribe({
      next: (result: Lecture[]) => {
        this.lectures = result;
        this.filteredLectures = result;
        this._prepareForDisplay();
      },
      error: () => {},
    });
  }

  private _prepareForDisplay() {
    this.lecturesForDisplay = this.filteredLectures.map((e) => {
      return {
        id: e.id,
        name: e.name,
        difficulty:
          e.difficulty.slice(0, 1).toUpperCase() +
          e.difficulty.slice(1).toLowerCase(),
        age: e.minRecommendedAge + ' - ' + e.maxRecommendedAge,
      } as LectureForTable;
    });
  }

  updateCategories(categories: string[]) {
    this.selectedCategories = categories;
    this.unselectedCategories = this.allCategories.filter((cat) => {
      return this.selectedCategories.indexOf(cat) < 0;
    });
    this._filter();
  }

  onViewLecture(lecture: LectureForTable) {
    console.log(lecture);
  }

  onDeleteLecture(lecture: LectureForTable) {
    this.service.deleteLecture(lecture.id).subscribe({
      next: () => {
        this.lecturesForDisplay = this.lecturesForDisplay.filter(
          (l) => l.id !== lecture.id
        );
      },
      error: () => {},
    });
  }

  onSearchInput() {
    this._filter();
  }

  onAgeInput() {
    this._filter();
  }

  onDifficultyChange() {
    this._filter();
  }

  private _filter() {
    this.filteredLectures = this.lectures.filter((l) => {
      let matchesSearch =
        this.searchText === ''
          ? true
          : l.name.toLocaleLowerCase().includes(this.searchText.toLowerCase());

      let matchesCategories = this.selectedCategories.length === 0;
      if (!matchesCategories) {
        this.selectedCategories.forEach((category) => {
          matchesCategories = matchesCategories
            ? true
            : l.categories.map((cat) => cat.description).indexOf(category) !==
              -1;
        });
      }

      let matchesAge =
        this.selectedAge === null
          ? true
          : this.selectedAge >= l.minRecommendedAge &&
            this.selectedAge <= l.maxRecommendedAge;

      let matchesDifficulty =
        this.selectedDifficulty === ''
          ? true
          : this.selectedDifficulty === l.difficulty;

      return (
        matchesSearch && matchesCategories && matchesAge && matchesDifficulty
      );
    });

    this._prepareForDisplay();
  }

  onCreateLecture() {
    this.router.navigate(['create-lecture']);
  }
}
