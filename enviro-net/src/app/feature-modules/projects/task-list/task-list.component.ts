import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProjectsService } from '../projects.service';
import { DocumentTask } from '../model/document-task.model';
import { Router } from '@angular/router';
import { Task } from '../model/task.model';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  userId: number;
  documents: DocumentTask[] = []; 
  pendingDocuments: DocumentTask[] = []; 
  Task = Task;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private dialog: MatDialog,
    authService: AuthService
  ) {
    this.userId = authService.user$.value.id;
  }

  ngOnInit() {
    this.getTasks();
    this.getPending();
  }

  getTasks() {
    this.projectsService.getAssignedDocuments(this.userId).subscribe(
      (documents) => {
        this.documents = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  getPending() {
    this.projectsService.getPendingDocuments(this.userId).subscribe(
      (documents) => {
        this.pendingDocuments = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  openReviewForm(document: DocumentTask) {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      width: '600px',
      data: { document: document, userId: this.userId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPending();
    });
  }

  open(document: DocumentTask) {
    this.router.navigate(['org/projects/tasks', document.projectId, document.documentId]);
  }
}
