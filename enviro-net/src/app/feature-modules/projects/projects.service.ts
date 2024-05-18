import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Project } from './model/project.model';
import { ProjectCreation } from './model/project-creation.model';
import { Document } from './model/document.model';
import { TeamMember } from './model/team-member.model';
import { TeamMemberCreation } from './model/team-member-creation.model';
import { Assignment } from './model/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getProjects(name: string, status: string, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Project>> {
    const params = this.buildParams(name, status, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Project>>(environment.apiHost + 'projects', { params });
  }

  getProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(environment.apiHost + `projects/${projectId}`);
  }

  createProject(project: ProjectCreation): Observable<Project> {
    return this.http.post<Project>(environment.apiHost + 'projects', project);
  }

  removeProject(projectId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + `projects/${projectId}`);
  }

  updateProject(projectId: number, project: ProjectCreation): Observable<Project> {
    return this.http.post<Project>(environment.apiHost + `projects/${projectId}`, project);
  }

  createDocument(projectId: number, documentData: FormData): Observable<Document> {
    return this.http.post<Document>(environment.apiHost + `projects/${projectId}/documents`, documentData);
  }

  deleteDocument(projectId: number, documentId: number): Observable<any> {
    return this.http.delete<any>(environment.apiHost + `projects/${projectId}/documents/${documentId}`);
  }

  getDocumentsByProject(projectId: number): Observable<Document[]> {
    return this.http.get<Document[]>(environment.apiHost + `projects/${projectId}/documents`);
  }

  getAvailableMembersByProject(projectId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(environment.apiHost + `projects/${projectId}/team/available`);
  }

  getTeamByProject(projectId: number): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(environment.apiHost + `projects/${projectId}/team`);
  }

  addTeamMember(projectId: number, teamMember: TeamMemberCreation): Observable<void> {
    return this.http.post<void>(environment.apiHost + `projects/${projectId}/team`, teamMember);
  }

  removeTeamMember(projectId: number, userId: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + `projects/${projectId}/team/${userId}`);
  }

  assignTeamMembers(projectId: number, assignment: Assignment): Observable<Document> {
    return this.http.put<Document>(environment.apiHost + `projects/${projectId}/team/assignment`, assignment);
  }

  private buildParams(name: string, status: string, page: number, size: number, sortBy: string, sortDirection: string): HttpParams {
    let params = new HttpParams()
      .set('name', name)
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortBy)
      .set('direction', sortDirection);

    return params;
  }
}
