import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Member } from './model/member.model';
import { Registration } from './model/registration.model';
import { Verification } from './model/verification.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getOrganizationMembers(name: string, surname: string, email: string, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Member>> {
    const params = this.buildParams(name, surname, email, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Member>>(environment.apiHost + 'users/members', { params });
  }

  removeOrganizationMember(memberId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + `users/members/${memberId}`);
  }

  registerMember(member: Registration): Observable<void> {
    return this.http.post<void>(environment.apiHost + `auth/register/members`, member);
  }

  verifyMember(member: Verification): Observable<void> {
    return this.http.post<void>(environment.apiHost + `auth/verify/members`, member);
  }

  private buildParams(name: string, surname: string, email: string, page: number, size: number, sortBy: string, sortDirection: string): HttpParams {
    let params = new HttpParams()
      .set('name', name)
      .set('surname', surname)
      .set('email', email)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortBy)
      .set('direction', sortDirection);

    return params;
  }
}
