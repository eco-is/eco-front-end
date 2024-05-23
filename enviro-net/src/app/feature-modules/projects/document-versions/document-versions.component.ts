import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { DocumentVersions } from '../model/document-versions.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { DocumentReview } from '../model/document-review.model';
import { DocumentReviewStatus } from '../model/document-review-status.model';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-document-versions',
  templateUrl: './document-versions.component.html',
  styleUrls: ['./document-versions.component.scss']
})
export class DocumentVersionsComponent implements OnInit {
  userId?: number;
  projectId?: number;
  documentId?: number;

  formGroup: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  
  isWriter: boolean = false;
  isReviewer: boolean = false;
  document?: DocumentVersions;
  reviews: DocumentReview[] = [];
  reviewStatuses: DocumentReviewStatus[] = [];

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    authService: AuthService
  ) {
    this.userId = authService.user$.value.id;
    this.formGroup = this.fb.group({
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('projectId')!;
      this.documentId = +params.get('documentId')!;

      this.getTask();
      this.getDocumentVersions();
      this.getDocumentReviews();
      this.getDocumentReviewStatuses();
    });
  }
  
  getDocumentVersions() {
    this.projectsService.getDocumentVersions(this.projectId!, this.documentId!).subscribe(
      (document) => {
        console.log(document);
        this.document = document;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

    getDocumentReviews() {
    this.projectsService.getDocumentReviews(this.projectId!, this.documentId!).subscribe(
      (reviews) => {
        console.log(reviews);
        this.reviews = reviews;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  getDocumentReviewStatuses() {
    this.projectsService.getDocumentReviewStatuses(this.projectId!, this.documentId!).subscribe(
      (statuses) => {
        console.log(statuses);
        this.reviewStatuses = statuses;
      },
      (error) => {
        console.error('Error fetching review statuses:', error);
      }
    );
  }

  getTask(): void {
    this.projectsService.getAssignmentTask(this.projectId!, this.documentId!, this.userId!).subscribe(
      (task) => {
        if (task === Task.WRITE) this.isWriter = true;
        else if (task === Task.REVIEW) this.isReviewer = true;
      },
      (error) => {
        console.error('Error fetching task:', error);
      }
    );
  }

  getReviewStatus(version: number): string {
    if (version === 0) return 'Template';

    const reviewStatus = this.reviewStatuses.find(status => status.version === version);
    return reviewStatus ? reviewStatus.status : 'Not reviewed yet';
  }

  isReviewed(version: number): boolean {
    if (version === 0) return true;
    return this.reviewStatuses.some(status => status.version === version);
  }

  requestReview(version: number): void {
    this.projectsService.createDocumentReviewRequest(this.projectId!, this.documentId!, version).subscribe(
      () => {
        this.getDocumentReviewStatuses();
      },
      (error) => {
        console.error('Error requesting review:', error);
      }
    );
  }

  upload() {
    if (this.formGroup.valid && this.projectId !== undefined && this.documentId !== undefined && this.selectedFile !== null) {
      const documentData = new FormData();
      documentData.append('progress', this.formGroup.value.progress);
      documentData.append('userId', this.userId!.toString()); 
      documentData.append('file', this.selectedFile);

      this.projectsService.uploadDocument(this.projectId, this.documentId, documentData).subscribe(
        response => {
          console.log('Document uploaded successfully:', response);
          this.formGroup.reset();
          this.selectedFile = null;
          this.getDocumentVersions();

          const fileInput: any = document.getElementById('file');
          if (fileInput) {
            fileInput.value = null;
          }
        },
        error => {
          console.error('Error creating document:', error);
        }
      );
    }
  }

  download(version: number) {
    this.projectsService.downloadDocument(this.projectId!, this.documentId!, version).subscribe(
      () => {
        console.log('Document downloaded successfully');
      },
      error => {
        console.error('Error downloading document:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.formGroup.patchValue({ file: this.selectedFile });
    }
  }
}
