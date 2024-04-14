import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserInfo } from '../model/user-info.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: User | undefined;
  userInfo: UserInfo | undefined;

  constructor(
    private authService: AuthService, 
    private service: AdministrationService, 
    private route: ActivatedRoute,
    private router: Router, 
    private snackBar: MatSnackBar
    ) {
      this.authService.user$.subscribe((user) => {
        this.user = user;
        this.getUser();
      });
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let token = params['token'] || null;
      let email = params['email'] || null;
      if (!token || !email) {
        this.router.navigate(['/my-profile']);
      } else {
        this.service.updateUserEmail(token, email).subscribe(
          (result) => {
            this.snackBar.open('Email updated successfully. New email address: ' + result.email, 'Close', { panelClass: 'green-snackbar' });
            this.router.navigate(['/my-profile']);
          },
          (error) => {
            let errorMessage = 'Error updating email. Please try again.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
            this.router.navigate(['/my-profile']);
          }
        );
      }
    });

    this.getUser();
  }

  getUser(): void {
    if (this.user) {
      this.service.getUser(this.user.id).subscribe((result) => {
        this.userInfo = result;
      }, 
      (error) => {
        let errorMessage = 'Error fetching user. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      });
    }
  }

  profileUpdate(): void {
    this.router.navigate(['edit-profile']);
  }
}
