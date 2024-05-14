import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Document } from '../model/document.model';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss']
})
export class DocumentFormComponent implements OnInit {
  projectId?: number;
  formGroup: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  documents: Document[] = [];
  
  // TODO css
  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    this.projectId = projectIdParam !== null ? +projectIdParam : 0;
    if (this.projectId) {
      this.getDocuments();
    }
  }

  getDocuments() {
    this.projectsService.getDocumentsByProject(this.projectId!).subscribe(
      (documents) => {
        console.log(documents);
        this.documents = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  upload() {
    if (this.formGroup.valid && this.projectId !== undefined && this.selectedFile !== null) {
      const documentData = new FormData();
      documentData.append('name', this.formGroup.value.name);
      documentData.append('file', this.selectedFile);

      this.projectsService.createDocument(this.projectId, documentData).subscribe(
        response => {
          console.log('Document created successfully:', response);
          this.formGroup.reset();
          this.selectedFile = null;
          this.getDocuments();

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

  remove(document: Document) {
    if (document && document.documentId && this.projectId) {
      this.projectsService.deleteDocument(this.projectId, document.documentId).subscribe(
        () => {
          console.log('Document deleted successfully');
          this.getDocuments();
        },
        (error) => {
          console.error('Error deleting document:', error);
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name; 
      this.formGroup.patchValue({ file: this.selectedFile });
    }
  }

  navigateToPreviousPage() {
    this.router.navigate(['org/projects', this.projectId, 'form']);
  }

  navigateToNextPage() {
    this.router.navigate(['org/projects', this.projectId, 'team']);
  }
}
