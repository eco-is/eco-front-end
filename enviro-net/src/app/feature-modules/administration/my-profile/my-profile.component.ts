import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router) {
      this.authService.user$.subscribe((user) => {
        this.user = user;
       }); 
    }

  ngOnInit(): void {
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
