import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../projects.service';
import { DocumentTask } from '../model/document-task.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentReviewCreation } from '../model/document-review-creation.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements AfterViewInit {

  reviewForm: FormGroup;
  @ViewChild('downloadButton') downloadButton!: ElementRef;

  constructor(
    private projectsService: ProjectsService,
    private dialogRef: MatDialogRef<ReviewFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { document: DocumentTask, userId: number },
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.maxLength(500)],
      isApproved: [null, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.downloadButton.nativeElement.focus();
    }, 0);
  }

  onDownload(): void {
    this.projectsService.downloadDocument(this.data.document.projectId, this.data.document.documentId, this.data.document.version).subscribe(
      () => {
        console.log('Document downloaded successfully');
      },
      error => {
        console.error('Error downloading document:', error);
      }
    );
  }

  onReview(): void {
    if (this.reviewForm.valid) {
      const review: DocumentReviewCreation = {
        ...this.reviewForm.value,
        userId: this.data.userId
      };
      this.projectsService.createDocumentReview(
        this.data.document.projectId,
        this.data.document.documentId,
        this.data.document.version,
        review).subscribe(
          () => {
            this.openSnackBar('Document sucessfully reviewed!');
            this.dialogRef.close();
        },
        (error) => {
          let errorMessage = 'Error reviewing document. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.openSnackBar(errorMessage);
          console.error('Error reviewing:', error);
        }        
      );
    } else {
      this.openSnackBar('Approval is required!');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }
}
