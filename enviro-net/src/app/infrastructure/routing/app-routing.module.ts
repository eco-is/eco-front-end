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
import { Role } from 'src/app/feature-modules/administration/model/role.model';
import { CreateTestComponent } from 'src/app/feature-modules/education/create-test/create-test.component';
import { LectureDetailsComponent } from 'src/app/feature-modules/education/lecture-details/lecture-details.component';
import { TestDetailsComponent } from 'src/app/feature-modules/education/test-details/test-details.component';
import { TakeTestComponent } from 'src/app/feature-modules/education/take-test/take-test.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
