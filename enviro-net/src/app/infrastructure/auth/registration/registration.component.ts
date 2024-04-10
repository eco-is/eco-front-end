import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  isButtonDisabled = true;
  passwordMessage = '';
  formGroup: FormGroup;
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
        phoneNumber: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        dateOfBirth: new FormControl('', [Validators.required]),
      });

  }

  ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.formGroup.valid || !this.passwordsMatch();
    });
  }

  passwordConfirmation = new FormControl('', [Validators.required]);

  passwordsMatch(): boolean {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.passwordConfirmation.value;

    this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';

    return password === confirmPassword;
  }

  register(): void {
    const registration: Registration = {
        firstName: this.formGroup.value.firstName || '',
        lastName: this.formGroup.value.lastName || '',
        email: this.formGroup.value.email || '',
        username: this.formGroup.value.username || '',
        phoneNumber: this.formGroup.value.phoneNumber || '',
        password: this.formGroup.value.password || '',
        gender: this.formGroup.value.gender || '', // assuming gender is part of the form
        dateOfBirth: this.formGroup.value.dateOfBirth || null, // assuming dateOfBirth is part of the form
      };

    if (this.formGroup.valid) {
      console.log(registration)
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }

  private getLatLongFromAddressOpenCage(address: string) {
    const apiKey = '7087c471f8054150abf1cd6421ae2324';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=en&limit=1`;
  
    return this.http.get(apiUrl);
  }
}