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
import { AuthGuard } from '../auth/auth.guard';
// Education
import { MyLecturesComponent } from 'src/app/feature-modules/education/my-lectures/my-lectures.component';
import { BrowseLecturesComponent } from 'src/app/feature-modules/education/browse-lectures/browse-lectures.component';
import { CreateTestComponent } from 'src/app/feature-modules/education/create-test/create-test.component';
import { LectureDetailsComponent } from 'src/app/feature-modules/education/lecture-details/lecture-details.component';
import { TestDetailsComponent } from 'src/app/feature-modules/education/test-details/test-details.component';
import { TakeTestComponent } from 'src/app/feature-modules/education/take-test/take-test.component';
// Finance
import { BudgetPlansListComponent } from 'src/app/feature-modules/finance/budget-plans-list/budget-plans-list.component';
import { BudgetPlanDetailsComponent } from 'src/app/feature-modules/finance/budget-plan-details/budget-plan-details.component';
import { BudgetPlanDetailsEditComponent } from 'src/app/feature-modules/finance/budget-plan-details-edit/budget-plan-details-edit.component';
import { OrganizationGoalsHistoryComponent } from 'src/app/feature-modules/finance/organization-goals-history/organization-goals-history.component';
import { OrganizationGoalsEditComponent } from 'src/app/feature-modules/finance/organization-goals-edit/organization-goals-edit.component';
import { CreateLectureComponent } from 'src/app/feature-modules/education/create-lecture/create-lecture.component';
import { FixedExpensesHistoryComponent } from 'src/app/feature-modules/finance/fixed-expenses-history/fixed-expenses-history.component';
import { LatestFixedExpensesComponent } from 'src/app/feature-modules/finance/latest-fixed-expenses/latest-fixed-expenses.component';
import { EstimateFixedExpensesComponent } from 'src/app/feature-modules/finance/estimate-fixed-expenses/estimate-fixed-expenses.component';
// Projects
import { ProjectsListComponent } from 'src/app/feature-modules/projects/projects-list/projects-list.component';
import { ProjectFormComponent } from 'src/app/feature-modules/projects/project-form/project-form.component';
import { DocumentFormComponent } from 'src/app/feature-modules/projects/document-form/document-form.component';
import { RankingsComponent } from 'src/app/feature-modules/education/rankings/rankings.component';
import { TeamFormComponent } from 'src/app/feature-modules/projects/team-form/team-form.component';
import { GlobalRankingsComponent } from 'src/app/feature-modules/education/global-rankings/global-rankings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/register', component: MemberRegistrationFormComponent },
  { path: 'admin/members', component: MembersListComponent },
  { path: 'confirm-email', component: MemberVerificationFormComponent },

  // Education
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
  {
    path: 'lecture-details/:id',
    component: LectureDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['EDUCATOR', 'REGISTERED_USER'],
    },
  },
  {
    path: 'test-details/:id',
    component: TestDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'EDUCATOR',
    },
  },
  {
    path: 'take-test/:id',
    component: TakeTestComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'REGISTERED_USER',
    },
  },
  {
    path: 'rankings/:id',
    component: RankingsComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'REGISTERED_USER',
    },
  },
  {
    path: 'global-rankings',
    component: GlobalRankingsComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'REGISTERED_USER',
    },
  },

  // Finance
  {
    path: 'budget-plans',
    component: BudgetPlansListComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['BOARD_MEMBER', 'ACCOUNTANT'],
    },
  },
  {
    path: 'budget-plan-details/:id',
    component: BudgetPlanDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['BOARD_MEMBER', 'ACCOUNTANT'],
    },
  },
  {
    path: 'edit-budget-plan-details/:id',
    component: BudgetPlanDetailsEditComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ACCOUNTANT',
    },
  },
  {
    path: 'edit-budget-plan-details',
    component: BudgetPlanDetailsEditComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ACCOUNTANT',
    },
  },
  {
    path: 'goals',
    component: OrganizationGoalsHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['BOARD_MEMBER', 'ACCOUNTANT'],
    },
  },
  {
    path: 'edit-goals',
    component: OrganizationGoalsEditComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'BOARD_MEMBER',
    },
  },
  {
    path: 'fixed-expenses',
    component: FixedExpensesHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['BOARD_MEMBER', 'ACCOUNTANT'],
    },
  },
  {
    path: 'fixed-expenses/latest',
    component: LatestFixedExpensesComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ACCOUNTANT',
    },
  },
  {
    path: 'fixed-expenses-estimate/:budgetPlanId',
    component: EstimateFixedExpensesComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['BOARD_MEMBER', 'ACCOUNTANT'],
    },
  },
  // Projects
  { path: 'org/projects', component: ProjectsListComponent },
  { path: 'org/projects/form', component: ProjectFormComponent },
  {
    path: 'org/projects/:projectId/documents',
    component: DocumentFormComponent,
  },
  { path: 'org/projects/:projectId/form', component: ProjectFormComponent },
  {
    path: 'org/projects/:projectId/documents',
    component: DocumentFormComponent,
  },
  { path: 'org/projects/:projectId/team', component: TeamFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
