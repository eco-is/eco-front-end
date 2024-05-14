import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Gender, Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as intlTelInput from 'intl-tel-input';
import { Login } from '../model/login.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  isButtonDisabled = true;
  passwordMessage = '';
  formGroup: FormGroup;
  genders = Object.values(Gender);
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) { 
    this.formGroup = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl(''),
        gender: new FormControl(null),
        dateOfBirth: new FormControl(''),
      });

  }

  ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.formGroup.valid || !this.passwordsMatch();
    });
    const inputElement = document.querySelector('#phone');
    if (inputElement) {
      intlTelInput(inputElement,{
        initialCountry: 'rs',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    });

  }
}

  passwordConfirmation = new FormControl('', [Validators.required]);

  passwordsMatch(): boolean {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.passwordConfirmation.value;

    this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';

    return password === confirmPassword;
  }

  register(): void {

    let genderValue: number | null = null;

    if (this.formGroup.value.gender === Gender.Male) {
      genderValue = 0;
    } else if (this.formGroup.value.gender === Gender.Female) {
      genderValue = 1;
    }

    const registration: Registration = {
        name: this.formGroup.value.firstName || '',
        surname: this.formGroup.value.lastName || '',
        email: this.formGroup.value.email || '',
        username: this.formGroup.value.username || '',
        phoneNumber: this.formGroup.value.phoneNumber || null,
        password: this.formGroup.value.password || '',
        gender: genderValue,
        dateOfBirth: this.formGroup.value.dateOfBirth || null,
        points: 0,
        role: 1,
      };
    if (this.formGroup.valid) {
      console.log(registration)
      this.authService.registerUser(registration).subscribe(
        (response) => {
          console.log('User registration successful:', response);
          const login: Login = {
            username: registration.username,
            password: registration.password,
          };
          this.authService.login(login).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (errorMessage) => {
              this.openSnackBar(errorMessage);
            },
          });
        },
        (error) => {
          this.openSnackBar('Username or email already taken.');
          //this.openSnackBar('Error registering user: ' + error);
        }
      );
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }

}