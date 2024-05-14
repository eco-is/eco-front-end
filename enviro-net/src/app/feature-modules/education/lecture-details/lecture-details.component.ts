import { Component } from '@angular/core';
import { Lecture } from '../model/lecture';
import { EducationService } from '../education.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TestExecution } from '../model/testExecution';

@Component({
  selector: 'app-lecture-details',
  templateUrl: './lecture-details.component.html',
  styleUrls: ['./lecture-details.component.scss'],
})
export class LectureDetailsComponent {
  lecture: Lecture | null = null;
  user: User | undefined;
  pointsEarned: number | null = null;
  retakeTest: boolean = false;
  otherActiveTest: boolean = false;

  constructor(
    private service: EducationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (user.role === 'REGISTERED_USER') {
        this.service
          .getTestExecutionByLectureId(+this.route.snapshot.paramMap.get('id')!)
          .subscribe({
            next: (result: TestExecution) => {
              if (result.finished) {
                this.pointsEarned = result.points;
                this.retakeTest = true;
              } else {
                this.router.navigate(
                  ['take-test', this.route.snapshot.paramMap.get('id')!],
                  { replaceUrl: true }
                );
              }
            },
            error: () => {
              this.service
                .getLectureById(+this.route.snapshot.paramMap.get('id')!)
                .subscribe({
                  next: (result: Lecture) => {
                    this.lecture = result;
                    this.service.getUnfinishedTest().subscribe({
                      next: (result: TestExecution) => {
                        this.otherActiveTest = true;
                      },
                      error: () => {},
                    });
                  },
                });
            },
            complete: () => {
              this.service
                .getLectureById(+this.route.snapshot.paramMap.get('id')!)
                .subscribe({
                  next: (result: Lecture) => {
                    this.lecture = result;
                    this.service.getUnfinishedTest().subscribe({
                      next: (result: TestExecution) => {
                        this.otherActiveTest = true;
                      },
                      error: () => {},
                    });
                  },
                });
            },
          });
      } else {
        this.service
          .getLectureById(+this.route.snapshot.paramMap.get('id')!)
          .subscribe({
            next: (result: Lecture) => {
              this.lecture = result;
            },
          });
      }
    });
  }

  onViewTest() {
    if (this.user?.role === 'EDUCATOR') {
      this.router.navigate(['test-details', this.lecture?.id]);
    } else if (this.user?.role === 'REGISTERED_USER') {
      this.router.navigate(['take-test', this.lecture?.id], {
        replaceUrl: true,
      });
    }
  }
}
