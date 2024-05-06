import { Component } from '@angular/core';
import { Lecture } from '../model/lecture';
import { EducationService } from '../education.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'app-lecture-details',
  templateUrl: './lecture-details.component.html',
  styleUrls: ['./lecture-details.component.scss'],
})
export class LectureDetailsComponent {
  lecture: Lecture | null = null;
  user: User | undefined;

  constructor(
    private service: EducationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.service
      .getLectureById(+this.route.snapshot.paramMap.get('id')!)
      .subscribe({
        next: (result: Lecture) => {
          this.lecture = result;
        },
      });
    this.authService.user$.subscribe((user) => {
      this.user = user;
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
