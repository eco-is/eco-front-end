import { Injectable } from '@angular/core';
// import { Registration } from './model/registration.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationResponse } from './model/authentication-response.model';
import { environment } from 'src/env/environment';
import { HttpClient } from '@angular/common/http';
import { Login } from './model/login.model';
import { TokenStorage } from './jwt/token.service';
import { Router } from '@angular/router';
import { User } from './model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User>({ username: '', id: 0, role: '' });

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  // register(registration: Registration): Observable<AuthenticationResponse> {
  //   return this.http.post<AuthenticationResponse>(environment.apiHost + 'users/register', registration)
  //     .pipe(
  //       catchError(() => {
  //         return throwError('An error occurred during registration.');
  //       })
  //     );
  // }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(
        environment.apiHost + 'auth/authenticate',
        login
      )
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.token);
          this.setUser();
        }),
        catchError(() => {
          return throwError(
            "Login failed. Please check your credentials.\nIf you haven't activated your account via the email link, please do so now to complete the registration process."
          );
        })
      );
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).sub,
      role: jwtHelperService.decodeToken(accessToken).role,
    };
    this.user$.next(user);
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  logout(): void {
    this.router.navigate(['/']).then(() => {
      this.tokenStorage.clear();
      this.user$.next({ id: 0, role: '', username: '' });
    });
  }

  getPasswordChanged(id: number): Observable<Boolean> {
    return this.http.get<Boolean>(
      environment.apiHost + 'users/password-change/' + id
    );
  }
}
