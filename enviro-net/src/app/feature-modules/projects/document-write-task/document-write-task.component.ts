import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { DocumentVersions } from '../model/document-versions.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'app-document-write-task',
  templateUrl: './document-write-task.component.html',
  styleUrls: ['./document-write-task.component.scss']
})
export class DocumentWriteTaskComponent implements OnInit {
  userId?: number;
  projectId?: number;
  documentId?: number;

  formGroup: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  document?: DocumentVersions;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
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

      this.getDocumentVersions();
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
