import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProjectsService } from '../projects.service';
import { DocumentTask } from '../model/document-task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  userId: number;
  documents: DocumentTask[] = []; 

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    authService: AuthService
  ) {
    this.userId = authService.user$.value.id;
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.projectsService.getAssignedDocuments(this.userId).subscribe(
      (documents) => {
        console.log(documents);
        this.documents = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  // TODO navigate to task review or write
  open(document: DocumentTask) {
    this.router.navigate(['org/projects/tasks', document.projectId, document.documentId]);
  }
}
