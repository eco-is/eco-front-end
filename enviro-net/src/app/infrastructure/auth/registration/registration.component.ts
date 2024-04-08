// import { Component } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { Registration } from '../model/registration.model';
// import { AuthService } from '../auth.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.scss']
// })
// export class RegistrationComponent {
//   isButtonDisabled = true;
//   passwordMessage = '';

//   constructor(
//     private authService: AuthService,
//     private snackBar: MatSnackBar,
//     private router: Router,
//     private http: HttpClient
//   ) { }

//   ngOnInit(): void {
//     this.registrationForm.statusChanges.subscribe(() => {
//       this.isButtonDisabled = !this.registrationForm.valid || !this.passwordsMatch();
//     });
//   }

//   passwordConfirmation = new FormControl('', [Validators.required]);

//   registrationForm = new FormGroup({
//     name: new FormControl('', [Validators.required]),
//     surname: new FormControl('', [Validators.required]),
//     occupation: new FormControl('', [Validators.required]),
//     phoneNumber: new FormControl('', [Validators.required]),
//     companyInfo: new FormControl('', [Validators.required]),
//     email: new FormControl('', [Validators.required]),
//     password: new FormControl('', [Validators.required]),
//     address: new FormGroup({
//       street: new FormControl('', [Validators.required]),
//       streetNumber: new FormControl('', [Validators.required]),
//       country: new FormControl('', [Validators.required]),
//       city: new FormControl('', [Validators.required]),
//     }),
//   });

//   passwordsMatch(): boolean {
//     const password = this.registrationForm.get('password')?.value;
//     const confirmPassword = this.passwordConfirmation.value;

//     this.passwordMessage = password === confirmPassword ? 'Passwords match' : 'Passwords do not match';

//     return password === confirmPassword;
//   }

//   register(): void {
//     const registration: Registration = {
//       name: this.registrationForm.value.name || '',
//       surname: this.registrationForm.value.surname || '',
//       email: this.registrationForm.value.email || '',
//       occupation: this.registrationForm.value.occupation || '',
//       phoneNumber: this.registrationForm.value.phoneNumber || '',
//       companyInfo: this.registrationForm.value.companyInfo || '',
//       password: this.registrationForm.value.password || '',

//       address: {
//         street: this.registrationForm.value.address?.street ?? '',
//         streetNumber: this.registrationForm.value.address?.streetNumber ?? '',
//         country: this.registrationForm.value.address?.country ?? '',
//         city: this.registrationForm.value.address?.city ?? '',
//         longitude: '',
//         latitude: '',
//       },
//     };

//     if (this.registrationForm.valid) {
//       const addressString = `${registration.address.streetNumber} ${registration.address.street}, ${registration.address.city}, ${registration.address.country}`;
  
//       this.getLatLongFromAddressOpenCage(addressString).subscribe(
//         (response: any) => {
//           if (response.results.length > 0) {
//             const latlng = response.results[0].geometry;
//             registration.address.latitude = latlng.lat;
//             registration.address.longitude = latlng.lng;
//             this.authService.register(registration).subscribe({
//               next: () => {
//                 this.openSnackBar('Registration successful! Check your email for the confirmation link.');
//                 this.router.navigate(['/login']);
//               },
//               error: () => {
//                 this.openSnackBar('An error occurred during registration.');
//               }
//             });
//           } else {
//             console.error('Geocoding response has no results.');
//           }
//         },
//         (error: any) => {
//           console.error('Error getting coordinates:', error);
//         }
//       );
//     }
//   }

//   private openSnackBar(message: string): void {
//     this.snackBar.open(message, 'Close', {
//       duration: 30000,
//     });
//   }

//   private getLatLongFromAddressOpenCage(address: string) {
//     const apiKey = '7087c471f8054150abf1cd6421ae2324';
//     const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&language=en&limit=1`;
  
//     return this.http.get(apiUrl);
//   }
// }