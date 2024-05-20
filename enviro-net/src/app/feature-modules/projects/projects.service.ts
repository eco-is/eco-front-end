import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Project } from './model/project.model';
import { ProjectCreation } from './model/project-creation.model';
import { Document } from './model/document.model';
import { TeamMember } from './model/team-member.model';
import { TeamMemberCreation } from './model/team-member-creation.model';
import { Assignment } from './model/assignment.model';
import { DocumentTask } from './model/document-task.model';
import { DocumentVersions } from './model/document-versions.model';
import { saveAs } from 'file-saver'

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

  getAssignedDocuments(userId: number): Observable<DocumentTask[]> {
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<DocumentTask[]>(environment.apiHost + 'projects/assignments', { params });
  }

  getDocumentVersions(projectId: number, documentId: number): Observable<DocumentVersions> {
    return this.http.get<DocumentVersions>(environment.apiHost + `projects/${projectId}/documents/${documentId}/versions`);
  }

  uploadDocument(projectId: number, documentId: number, documentData: FormData): Observable<Document> {
    return this.http.put<Document>(environment.apiHost + `projects/${projectId}/documents/${documentId}`, documentData);
  }

  downloadDocument(projectId: number, documentId: number, version: number): Observable<void> {
    return this.http.get(environment.apiHost + `projects/${projectId}/documents/${documentId}/versions/${version}`, { responseType: 'blob', observe: 'response' })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const contentDisposition = response.headers.get('Content-Disposition');
          const matches = contentDisposition?.match(/filename="([^"]+)"/);
          const filename = matches ? matches[1] : 'document';

          const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
          const blob = new Blob([response.body!], { type: contentType });
          saveAs(blob, filename);
          return;
        })
      );
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
