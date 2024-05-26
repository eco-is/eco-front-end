import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Member } from './model/member.model';
import { Registration } from './model/registration.model';
import { Verification } from './model/verification.model';
import { UserInfo } from './model/user-info.model';
import { Notification } from './model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getOrganizationMembers(name: string, surname: string, email: string, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Member>> {
    const params = this.buildParams(name, surname, email, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Member>>(environment.apiHost + 'users/members', { params });
  }

  getUserByRoles(roles : string[]): Observable<Member[]> {
    const params = this.buildParamsRoles(roles);
    return this.http.get<Member[]>(environment.apiHost + 'users/user-roles', { params });
  }
  private buildParamsRoles(roles: string[]): HttpParams {
    let params = new HttpParams();
    if (roles && roles.length > 0) {
        roles.forEach(role => {
          params = params.append('roles', role);
        });
    }
    return params;
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

  getUser(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(environment.apiHost + 'users/get-user/' + id);
  }

  updateUser(userInfo: UserInfo): Observable<UserInfo> {
    const options = {  headers: new HttpHeaders() };
    return this.http.put<UserInfo>(environment.apiHost + 'users/update-user/' + userInfo.id, userInfo, options);
  }

  updateUserEmail(token: string, newEmail: string): Observable<any> {
    const options = { headers: new HttpHeaders() };
    const params = new HttpParams().set('token', token);
    return this.http.put<UserInfo>(environment.apiHost + 'users/update-email/' + newEmail, {}, { params });
  }

  // Notifications
  getAllNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(environment.apiHost + "notifications/all/" + userId);
  }

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(environment.apiHost + "notifications/unread/" + userId);
  }

  sendNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(environment.apiHost + "notifications/new", notification, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  sendNotificationAndEmail(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(environment.apiHost + "notifications/new/email", notification, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  readNotification(notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(environment.apiHost + "notifications/read", notification, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  markAsUnread(notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(environment.apiHost + "notifications/unread", notification, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  readAllNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(environment.apiHost + "notifications/read/all/" + userId);
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + "notifications/delete/" + notificationId);
  }
}
