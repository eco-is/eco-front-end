import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { UserInfo } from './model/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

    constructor(private http: HttpClient) { }

    getUser(id: number): Observable<UserInfo> {
      return this.http.get<UserInfo>(environment.apiHost + 'users/get-user/' + id);
    }

    updateUser(userInfo: UserInfo): Observable<UserInfo> {
      const options = {  headers: new HttpHeaders() };
      return this.http.put<UserInfo>(environment.apiHost + 'users/update-user/' + userInfo.id, userInfo, options);
    }
}