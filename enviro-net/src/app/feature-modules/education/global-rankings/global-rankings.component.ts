import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EducationService } from '../education.service';
import { UserInfo } from '../../administration/model/user-info.model';
import { TestExecution } from '../model/testExecution';
import { forkJoin } from 'rxjs';

type Ranking = {
  rank: number;
  username: string;
  points: number;
};

@Component({
  selector: 'app-global-rankings',
  templateUrl: './global-rankings.component.html',
  styleUrls: ['./global-rankings.component.scss'],
})
export class GlobalRankingsComponent {
  rankings: Ranking[] = [];
  users: UserInfo[] = [];
  displayedColumns = ['rank', 'username', 'points'];

  constructor(private service: EducationService) {
    this.service.getAllFinishedTestExecutions().subscribe({
      next: (result: TestExecution[]) => {
        const seen = new Set();
        const uniqueUsers = result.filter((item) => {
          const val = item.userId;
          if (seen.has(val)) {
            return false;
          }
          seen.add(val);
          return true;
        });
        forkJoin(
          uniqueUsers.map((result) => {
            return this.service.getUser(result.userId);
          })
        ).subscribe({
          next: (results: UserInfo[]) => {
            this.users = results;
            this.users.forEach((user) => {
              const usersExecutions = result.filter(
                (res) => res.userId == user.id
              );
              this.rankings.push({
                rank: 0,
                username: user.username,
                points: usersExecutions.reduce(
                  (prev, curr) => prev + curr.points,
                  0
                ),
              });
            });
            this.rankings = this.rankings
              .sort((a, b) => b.points - a.points)
              .map((ranking, idx) => {
                ranking.rank = idx + 1;
                return ranking;
              });
          },
        });
      },
    });
  }
}
