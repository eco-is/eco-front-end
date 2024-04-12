import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Verification } from '../model/verification.model';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Login } from 'src/app/infrastructure/auth/model/login.model';

@Component({
  selector: 'app-member-verification-form',
  templateUrl: './member-verification-form.component.html',
  styleUrls: ['./member-verification-form.component.scss']
})
export class MemberVerificationFormComponent implements OnInit {
  token: string | null = null;
  isButtonDisabled = true;
  passwordMessage = '';
  formGroup: FormGroup;

  constructor(
    private adminService: AdministrationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar) { 
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordConfirmation: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      if (!this.token) {
        this.openSnackBar('Invalid verification link.')
        this.router.navigate(['/']);
        this.formGroup.statusChanges.subscribe(() => {
          this.isButtonDisabled = !this.formGroup.valid || !this.passwordsMatch();
        });
      }
    });
  }

  passwordConfirmation = new FormControl('', [Validators.required]);

  passwordsMatch(): boolean {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.formGroup.get('passwordConfirmation')?.value;

    this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';

    return password === confirmPassword;
  }

  verify(): void {
    const verification: Verification = {
      token: this.token!,
      username: this.formGroup.value.username || '',
      password: this.formGroup.value.password || '',
    };

    if (this.formGroup.valid) {
      this.adminService.verifyMember(verification).subscribe(
        (response) => {
          const login: Login = {
            username: verification.username,
            password: verification.password,
          };
          this.authService.login(login).subscribe({
            next: () => {
              this.openSnackBar('Member verified successfully!');
              this.router.navigate(['/']); 
            },
            error: (errorMessage) => {
              this.openSnackBar(errorMessage);
            },
          });
        },
        (error) => {
          if (error.status === 409) {
            this.openSnackBar(error.message); 
          } else if (error.status === 403) {
            this.openSnackBar('Link invalid or expired.');
            this.router.navigate(['/']); 
          } else {
            this.openSnackBar('Error verifying member: ' + error.message);
          }
        }
      );
    }
  }


  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }
}
