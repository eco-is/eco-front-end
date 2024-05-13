import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { MyProfileComponent } from 'src/app/feature-modules/administration/my-profile/my-profile.component';
import { EditProfileComponent } from 'src/app/feature-modules/administration/edit-profile/edit-profile.component';
import { LoginComponent } from '../auth/login/login.component';
import { MembersListComponent } from 'src/app/feature-modules/administration/members-list/members-list.component';
import { MemberRegistrationFormComponent } from 'src/app/feature-modules/administration/member-registration-form/member-registration-form.component';
import { MemberVerificationFormComponent } from 'src/app/feature-modules/administration/member-verification-form/member-verification-form.component';
import { ProjectsListComponent } from 'src/app/feature-modules/projects/projects-list/projects-list.component';
import { TeamFormComponent } from 'src/app/feature-modules/projects/team-form/team-form.component';
import { ProjectFormComponent } from 'src/app/feature-modules/projects/project-form/project-form.component';
import { DocumentCreationComponent } from 'src/app/feature-modules/projects/document-creation/document-creation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegistrationComponent},
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component:  MemberRegistrationFormComponent},
  { path: 'admin/members', component: MembersListComponent },
  { path: 'confirm-email', component: MemberVerificationFormComponent },
  { path: 'org/projects', component: ProjectsListComponent },
  { path: 'org/projects/form', component: ProjectFormComponent },
  { path: 'org/projects/:projectId/documents', component: DocumentCreationComponent },
  { path: 'org/projects/:projectId/team', component: TeamFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
