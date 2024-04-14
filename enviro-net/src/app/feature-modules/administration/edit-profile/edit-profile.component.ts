import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as intlTelInput from 'intl-tel-input';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserInfo, Gender } from '../model/user-info.model';
import { AdministrationService } from '../administration.service';
import { Login } from 'src/app/infrastructure/auth/model/login.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent  implements OnInit {
  isButtonDisabled = true;
  passwordMessage = '';
  genders = Object.values(Gender);
  user: User | undefined;
  userInfo: UserInfo | undefined;
  phoneNumberField: any; // Declare phoneNumberField as a class property
  selectedCountryData: string = '+381';

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
    oldPassword: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    gender: new FormControl(''),
    dateOfBirth: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private service: AdministrationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient) { }
  
  getUser(user: User): void {
    if (user) {
      this.service.getUser(user.id).subscribe((result) => {
        this.userInfo = result;
     
        // Parse the date string into a Date object
        const dateOfBirth = new Date(this.userInfo!.dateOfBirth); 
        const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0]; // Format the date as 'yyyy-MM-dd'

        // Parse the phone number using intlTelInput
        const inputElement = document.querySelector('#phone');
        if (inputElement) {
          this.phoneNumberField = intlTelInput(inputElement, {
            initialCountry: 'auto',
            separateDialCode: true,
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
          });
          this.phoneNumberField.setNumber(this.userInfo!.phoneNumber); // Set the formatted phone number in the input field
          this.selectedCountryData = "+" + this.phoneNumberField.getSelectedCountryData().dialCode; // Get the selected country dial code
        }

        this.formGroup.patchValue({
          name: this.userInfo!.name,
          surname: this.userInfo!.surname,
          email: this.userInfo!.email,
          phoneNumber: this.userInfo!.phoneNumber,
          gender: this.userInfo!.gender,
          dateOfBirth: formattedDateOfBirth,
        });
      }, 
      (error) => {
        let errorMessage = 'Error fetching user. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      });
    }
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.getUser(this.user);
    });

    this.formGroup.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.formGroup.valid || !this.passwordsMatch();
    });
  }

  profileUpdate(): void {
    this.userInfo!.email = this.formGroup.value.email!;
    this.passwordChange();

    this.userInfo!.name = this.formGroup.value.name!;
    this.userInfo!.surname = this.formGroup.value.surname!;
    // Gender
    if (this.formGroup.value.gender?.startsWith("FE")) this.userInfo!.gender = (Gender).Female;
    else this.userInfo!.gender = (Gender).Male;    

    // Date of Birth
    const dateOfBirthString = this.formGroup.value.dateOfBirth;
    if (dateOfBirthString) {
      const dateOfBirth = new Date(dateOfBirthString);
      this.userInfo!.dateOfBirth = dateOfBirth;
    } else {
      console.error("invalid date of birth value in user");
    }

    // PhoneNumber
    this.userInfo!.phoneNumber = this.formGroup.value.phoneNumber!.replace(/\s/g, "");
    if (!this.userInfo?.phoneNumber.startsWith('+')){
      this.userInfo!.phoneNumber = this.selectedCountryData + this.userInfo!.phoneNumber;
    } 
    let updatedPhoneNumber = this.userInfo!.phoneNumber;
    // Check if the selected country code is different from the original one
    // If country code is different, update the phone number accordingly
    const newCountryCode = "+" + this.phoneNumberField.getSelectedCountryData().dialCode;
    if (newCountryCode !== this.selectedCountryData) {
      updatedPhoneNumber = updatedPhoneNumber.replace(this.selectedCountryData, newCountryCode);
    }
    this.userInfo!.phoneNumber = updatedPhoneNumber;
   
    const loadingSnackbar = this.snackBar.open('User updating...', '', { panelClass: 'green-snackbar' });
    this.service.updateUser(this.userInfo!).subscribe(
      (updatedUser) => {
        loadingSnackbar.dismiss();
        this.snackBar.open('User information updated successfully!', 'Close' , { panelClass: 'green-snackbar' });
        this.router.navigate(['my-profile']);
      }, 
      (error) => {
        let errorMessage = 'Error updating user. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      }
    );
  }

  passwordsMatch(): boolean {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.formGroup.get('confirmPassword')?.value;
    this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';
    console.log(this.passwordMessage)
    
    return password === confirmPassword;
  }
  
  canPasswordChange(): boolean {
    if (this.passwordsMatch() && 
        this.formGroup.value.oldPassword !== '' &&
        this.formGroup.value.password !== '' &&    
        this.formGroup.value.confirmPassword !== '') {
      this.isButtonDisabled = false;
      return true;
    } else {
      this.isButtonDisabled = true;
      return false;
    }
  }

  passwordChange(): void {
    if (this.canPasswordChange()) {
      let oldPassword: Login = {
        username: this.user!.username,
        password: this.formGroup.value.oldPassword!
      }
      this.authService.checkOldPassword(oldPassword).subscribe(
        (isValid) => {
          if (!isValid) {
            this.snackBar.open('Old user password incorrect! Password couldn\'t update. Try again', 'Close');
          } else {
            let request: Login = {
              username: this.user!.username,
              password: this.formGroup.value.password!,
            }
            const loadingSnackbar = this.snackBar.open('User password updating...', '', { panelClass: 'green-snackbar' });
            this.authService.changePassword(request).subscribe(
              (result) => {
                loadingSnackbar.dismiss();
                this.snackBar.open('User password changed! Login with new password!', 'Close', { panelClass: 'green-snackbar' });
                this.authService.logout();
                this.router.navigate(['login']);
              },
              (error) => {
                this.snackBar.open('Error while updating user password', 'Close', { panelClass: 'green-snackbar' });
                let errorMessage = 'Error while updating user password. Please try again.';
                if (error.error && error.error.message) {
                  errorMessage = error.error.message;
                }
              }
            );
          }
        },
        (error) => {
          let errorMessage = 'Error in old password input. Please try again.';
          console.error(errorMessage);
          this.snackBar.open(errorMessage, 'Close' , { panelClass: 'green-snackbar' });
      });
    }
    else {
      this.snackBar.open('Please check your input!', 'Close' , { panelClass: 'green-snackbar' });      
    }
  }
}
