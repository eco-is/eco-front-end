import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ProjectFormComponent } from './project-form/project-form.component';
import { DocumentFormComponent } from './document-form/document-form.component';



@NgModule({
  declarations: [
    ProjectsListComponent,
    ProjectFormComponent,
    DocumentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule
  ]
})
export class ProjectsModule { }
