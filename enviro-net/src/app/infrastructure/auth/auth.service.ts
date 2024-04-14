import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationResponse } from './model/authentication-response.model';
import { environment } from 'src/env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Login } from './model/login.model';
import { TokenStorage } from './jwt/token.service';
import { Router } from '@angular/router';
import { User } from './model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Registration } from './model/registration.model';

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

  registerUser(registration: Registration): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(environment.apiHost + 'auth/register', registration)
      .pipe(
        catchError(() => {
          return throwError('An error occurred during registration.');
        })
      );
  }

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

  checkOldPassword(changeRequest: Login): Observable<boolean> {
    return this.http.post<boolean>(environment.apiHost + 'auth/check-old-password', changeRequest);
  }

  changePassword(changeRequest: Login): Observable<Login> {
    const token = this.tokenStorage.getAccessToken() || '';
    const params = new HttpParams().set('token', token);
    return this.http.put<Login>(environment.apiHost + 'auth/change-password', changeRequest, { params });
  }
}
