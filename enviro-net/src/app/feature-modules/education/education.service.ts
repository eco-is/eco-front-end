import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lecture } from './model/lecture';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Category } from './model/category';
import { LectureCreationRequest } from './model/lectureCreationRequest';
import { EducatorQuestion } from './model/educatorQuestion';
import { UserQuestion } from './model/userQuestion';
import { TestExecution } from './model/testExecution';
import { TestCompletionResponse } from './model/testCompletionResponse';
import { TestCompletionRequest } from './model/testCompletionRequest';
import { UserInfo } from '../administration/model/user-info.model';

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

  createLecture(lecture: LectureCreationRequest): Observable<Lecture> {
    return this.http.post<Lecture>(environment.apiHost + 'lecture', lecture);
  }

  createQuestion(question: EducatorQuestion): Observable<EducatorQuestion> {
    return this.http.post<EducatorQuestion>(
      environment.apiHost + 'question',
      question
    );
  }

  getLectureById(id: number): Observable<Lecture> {
    return this.http.get<Lecture>(environment.apiHost + 'lecture/' + id);
  }

  getAllQuestionsByLectureIdForEducator(
    lectureId: number
  ): Observable<EducatorQuestion[]> {
    return this.http.get<EducatorQuestion[]>(
      environment.apiHost + 'question/educator/lecture?lectureId=' + lectureId
    );
  }

  getAllQuestionsByLectureIdForUser(
    lectureId: number
  ): Observable<UserQuestion[]> {
    return this.http.get<UserQuestion[]>(
      environment.apiHost + 'question/user/lecture?lectureId=' + lectureId
    );
  }

  startTest(lectureId: number): Observable<TestExecution> {
    return this.http.post<TestExecution>(
      environment.apiHost + 'test-execution/start/' + lectureId,
      ''
    );
  }

  completeTest(
    request: TestCompletionRequest
  ): Observable<TestCompletionResponse> {
    return this.http.put<TestCompletionResponse>(
      environment.apiHost + 'test-execution/complete',
      request
    );
  }

  getTestExecutionByLectureId(lectureId: number): Observable<TestExecution> {
    return this.http.get<TestExecution>(
      environment.apiHost + 'test-execution/lecture?lectureId=' + lectureId
    );
  }

  getUnfinishedTest(): Observable<TestExecution> {
    return this.http.get<TestExecution>(
      environment.apiHost + 'test-execution/unfinished'
    );
  }

  getAllTestExecutionsByLectureId(
    lectureId: number
  ): Observable<TestExecution[]> {
    return this.http.get<TestExecution[]>(
      environment.apiHost +
        'test-execution/lecture/finished?lectureId=' +
        lectureId
    );
  }

  getUser(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      environment.apiHost + 'users/get-user/' + id
    );
  }

  getAllFinishedTestExecutions(): Observable<TestExecution[]> {
    return this.http.get<TestExecution[]>(
      environment.apiHost + 'test-execution/finished'
    );
  }
}
