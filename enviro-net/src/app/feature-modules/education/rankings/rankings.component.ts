import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lecture } from '../model/lecture';
import { EducationService } from '../education.service';
import { TestExecution } from '../model/testExecution';
import { UserInfo } from '../../administration/model/user-info.model';
import { forkJoin } from 'rxjs';

type Ranking = {
  rank: number;
  username: string;
  points: number;
};

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss'],
})
export class RankingsComponent {
  lecture: Lecture | null = null;
  rankings: Ranking[] = [];
  users: UserInfo[] = [];
  displayedColumns = ['rank', 'username', 'points'];

  constructor(
    private route: ActivatedRoute,
    private service: EducationService
  ) {
    service.getLectureById(+route.snapshot.paramMap.get('id')!).subscribe({
      next: (result: Lecture) => {
        this.lecture = result;
        this.service
          .getAllTestExecutionsByLectureId(this.lecture.id)
          .subscribe({
            next: (result: TestExecution[]) => {
              forkJoin(
                result.map((result) => {
                  return this.service.getUser(result.userId);
                })
              ).subscribe({
                next: (results: UserInfo[]) => {
                  this.users = results;
                  this.rankings = result
                    .sort((a, b) => b.points - a.points)
                    .map((result, index) => {
                      return {
                        rank: index + 1,
                        username: this.users.find(
                          (user) => user.id === result.userId
                        )!.username,
                        points: result.points,
                      };
                    });
                },
              });
            },
          });
      },
      error: () => {},
    });
  }
}
