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
import { BudgetPlansListComponent } from 'src/app/feature-modules/finance/budget-plans-list/budget-plans-list.component';
import { BudgetPlanDetailsComponent } from 'src/app/feature-modules/finance/budget-plan-details/budget-plan-details.component';
import { BudgetPlanDetailsEditComponent } from 'src/app/feature-modules/finance/budget-plan-details-edit/budget-plan-details-edit.component';
import { MyLecturesComponent } from 'src/app/feature-modules/education/my-lectures/my-lectures.component';
import { BrowseLecturesComponent } from 'src/app/feature-modules/education/browse-lectures/browse-lectures.component';
import { CreateLectureComponent } from 'src/app/feature-modules/education/create-lecture/create-lecture.component';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTestComponent } from 'src/app/feature-modules/education/create-test/create-test.component';
import { ProjectsListComponent } from 'src/app/feature-modules/projects/projects-list/projects-list.component';
import { ProjectFormComponent } from 'src/app/feature-modules/projects/project-form/project-form.component';
import { DocumentFormComponent } from 'src/app/feature-modules/projects/document-form/document-form.component';
import { TeamFormComponent } from 'src/app/feature-modules/projects/team-form/team-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: MemberRegistrationFormComponent },
  { path: 'admin/members', component: MembersListComponent },
  { path: 'confirm-email', component: MemberVerificationFormComponent },
  //EDUCATION
  {
    path: 'my-lectures',
    component: MyLecturesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'EDUCATOR',
    },
  },
  {
    path: 'browse-lectures',
    component: BrowseLecturesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'REGISTERED_USER',
    },
  },
  {
    path: 'create-lecture',
    component: CreateLectureComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'EDUCATOR',
    },
  },
  {
    path: 'create-test/:id',
    component: CreateTestComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'EDUCATOR',
    },
  },

  //FINANCE
  { path: 'budget-plans', component: BudgetPlansListComponent },
  { path: 'budget-plan-details/:id', component: BudgetPlanDetailsComponent },
  {
    path: 'edit-budget-plan-details/:id',
    component: BudgetPlanDetailsEditComponent,
  },
  {
    path: 'edit-budget-plan-details',
    component: BudgetPlanDetailsEditComponent,
  },
  { path: 'org/projects', component: ProjectsListComponent },
  { path: 'org/projects/form', component: ProjectFormComponent },
  { path: 'org/projects/:projectId/form', component: ProjectFormComponent },
  { path: 'org/projects/:projectId/documents', component: DocumentFormComponent },
  { path: 'org/projects/:projectId/team', component: TeamFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
