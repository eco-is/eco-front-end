import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Project } from './model/project.model';
import { ProjectCreation } from './model/project-creation.model';
import { Document } from './model/document.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getProjects(name: string, status: string, page: number, size: number, sortBy: string, sortDirection: string): Observable<PagedResults<Project>> {
    const params = this.buildParams(name, status, page, size, sortBy, sortDirection);
    return this.http.get<PagedResults<Project>>(environment.apiHost + 'projects', { params });
  }

  createProject(project: ProjectCreation): Observable<Project> {
    return this.http.post<Project>(environment.apiHost + 'projects', project);
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
