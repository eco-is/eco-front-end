import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProjectCreation } from '../model/project-creation.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ProjectsService } from '../projects.service';
import { Type } from '../model/type.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent {
  userId: number;
  isButtonDisabled = true;
  formGroup: FormGroup;
  types = Object.values(Type);

  // TODO css
  constructor(
    private projectService: ProjectsService,
    private snackBar: MatSnackBar,
    private router: Router,
    authService: AuthService
  ) {
    this.userId = authService.user$.value.id;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      duration: new FormControl(0, [Validators.required]),
      budget: new FormControl(0, [Validators.required]),
      type: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(() => {
      this.isButtonDisabled = !this.formGroup.valid;
    });
  }

  create(): void {
    const project: ProjectCreation = {
      name: this.formGroup.value.name || '',
      description: this.formGroup.value.description || '',
      durationMonths: this.formGroup.value.duration,
      budget: this.formGroup.value.budget,
      type: this.formGroup.value.type as Type, 
      managerId: this.userId
    };

    if (this.formGroup.valid) {
      this.projectService.createProject(project).subscribe(
        (createdProject) => {
          this.openSnackBar('Project created successfully!');
          this.router.navigate(['org/projects', createdProject.id, 'documents']);
        },
        (error) => {
          let errorMessage = 'Error creating project. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.openSnackBar(errorMessage);
          console.error('Error creating project:', error);
        }
      );
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }
}
