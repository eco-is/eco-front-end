import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as intlTelInput from 'intl-tel-input';
import { Registration } from '../model/registration.model';
import { AdministrationService } from '../administration.service';
import { Role, RoleOrdinals } from '../model/role.model';

@Component({
  selector: 'app-member-registration-form',
  templateUrl: './member-registration-form.component.html',
  styleUrls: ['./member-registration-form.component.scss']
})
export class MemberRegistrationFormComponent {
  isButtonDisabled = true;
  formGroup: FormGroup; 
  roles: Role[] = Object.values(Role).slice(2); 

  constructor(
    private adminService: AdministrationService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl(''),
      role: new FormControl(Role.ACCOUNTANT, [Validators.required]),
    });

  }

  ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.formGroup.valid;
    });
    const inputElement = document.querySelector('#phone');
    if (inputElement) {
      intlTelInput(inputElement, {
        initialCountry: 'rs',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
      });

    }
  }

  register(): void {
    const selectedRoleOrdinal = RoleOrdinals[this.formGroup.value.role as Role];
    const registration: Registration = {
      name: this.formGroup.value.firstName || '',
      surname: this.formGroup.value.lastName || '',
      email: this.formGroup.value.email || '',
      phoneNumber: this.formGroup.value.phoneNumber || '',
      role: selectedRoleOrdinal,
    };

    if (this.formGroup.valid) {
      console.log(registration)
    }

    if (this.formGroup.valid) {
      const loadingSnackbar = this.snackBar.open('Registering member...', '', {
        panelClass: 'green-snackbar'
      });

      this.adminService.registerMember(registration).subscribe(
        () => {
          loadingSnackbar.dismiss();
          this.openSnackBar('Member registered successfully!');
          this.router.navigate(['/admin/members']);
        },
        (error) => {
          let errorMessage = 'Error registering member. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.openSnackBar(errorMessage);
          console.error('Error registering member:', error);
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
