// import { Component } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { Router } from '@angular/router';
// import { Login } from '../model/login.model';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'xp-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {

//   errorMessage: string = '';

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) { }

//   loginForm = new FormGroup({
//     email: new FormControl('', [Validators.required]),
//     password: new FormControl('', [Validators.required]),
//   });

//   login(): void {
//     const login: Login = {
//       email: this.loginForm.value.email || "",
//       password: this.loginForm.value.password || "",
//     };

//     if (this.loginForm.valid) {
//       this.authService.login(login).subscribe({
//         next: () => {
//           if(this.authService.user$.value.role == 'SYSTEM_ADMIN' || this.authService.user$.value.role == 'COMPANY_ADMIN') {
//             this.authService.getPasswordChanged(this.authService.user$.value.id).subscribe({
//               next: (result) => {
//                 if (!result)
//                   this.router.navigate(['change-password']);
//               },
//               error: (errorMessage) => {
//                 this.openSnackBar(errorMessage);
//               }
//             });
//           }
//           this.router.navigate(['/']);
//         },
//         error: (errorMessage) => {
//           this.openSnackBar(errorMessage);
//         }
//       });
//     }
//   }

//   private openSnackBar(message: string): void {
//     this.snackBar.open(message, 'Close', {
//       duration: 30000,
//     });
//   }
// }
