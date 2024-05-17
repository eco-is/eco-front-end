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
// Education
import { MyLecturesComponent } from 'src/app/feature-modules/education/my-lectures/my-lectures.component';
import { BrowseLecturesComponent } from 'src/app/feature-modules/education/browse-lectures/browse-lectures.component';
// Finance
import { BudgetPlansListComponent } from 'src/app/feature-modules/finance/budget-plans-list/budget-plans-list.component';
import { BudgetPlanDetailsComponent } from 'src/app/feature-modules/finance/budget-plan-details/budget-plan-details.component';
import { BudgetPlanDetailsEditComponent } from 'src/app/feature-modules/finance/budget-plan-details-edit/budget-plan-details-edit.component';
import { OrganizationGoalsHistoryComponent } from 'src/app/feature-modules/finance/organization-goals-history/organization-goals-history.component';
import { OrganizationGoalsEditComponent } from 'src/app/feature-modules/finance/organization-goals-edit/organization-goals-edit.component';

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
  { path: 'my-lectures', component: MyLecturesComponent },
  { path: 'browse-lectures', component: BrowseLecturesComponent },

  // Finance
  { path: 'budget-plans', component: BudgetPlansListComponent },
  { path: 'budget-plan-details/:id', component: BudgetPlanDetailsComponent },
  { path: 'edit-budget-plan-details/:id', component: BudgetPlanDetailsEditComponent },
  { path: 'edit-budget-plan-details', component: BudgetPlanDetailsEditComponent },
  { path: 'goals', component: OrganizationGoalsHistoryComponent },
  { path: 'edit-goals', component: OrganizationGoalsEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
