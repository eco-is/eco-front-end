import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Lecture } from './model/lecture';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Category } from './model/category';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor(private http: HttpClient) {}

  getAllLecturesByCreatorId(creatorId: number): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(
      environment.apiHost + 'lecture?creatorId=' + creatorId
    );
  }

  getAllLectures(): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(environment.apiHost + 'lecture/all');
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      environment.apiHost + 'lecture/categories/all'
    );
  }

  deleteLecture(id: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'lecture/' + id);
  }
}
