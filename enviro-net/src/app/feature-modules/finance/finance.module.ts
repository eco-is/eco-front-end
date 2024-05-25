import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { BudgetPlansListComponent } from './budget-plans-list/budget-plans-list.component';
import { BudgetPlanDetailsComponent } from './budget-plan-details/budget-plan-details.component';
import { BudgetPlanDetailsEditComponent } from './budget-plan-details-edit/budget-plan-details-edit.component';
import { OrganizationGoalsHistoryComponent } from './organization-goals-history/organization-goals-history.component';
import { OrganizationGoalsEditComponent } from './organization-goals-edit/organization-goals-edit.component';
import { FixedExpensesHistoryComponent } from './fixed-expenses-history/fixed-expenses-history.component';
import { LatestFixedExpensesComponent } from './latest-fixed-expenses/latest-fixed-expenses.component';
import { EstimateFixedExpensesComponent } from './estimate-fixed-expenses/estimate-fixed-expenses.component';
import { RevenueHistoryComponent } from './revenue-history/revenue-history.component';
import { BudgetPlanProjectsComponent } from './budget-plan-projects/budget-plan-projects.component';

@NgModule({
    declarations: [
      BudgetPlansListComponent,
      BudgetPlanDetailsComponent,
      BudgetPlanDetailsEditComponent,
      OrganizationGoalsHistoryComponent,
      OrganizationGoalsEditComponent,
      FixedExpensesHistoryComponent,
      LatestFixedExpensesComponent,
      EstimateFixedExpensesComponent,
      RevenueHistoryComponent,
      BudgetPlanProjectsComponent
  ],
    imports: [
      CommonModule,
      MaterialModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatSelectModule,
      MatTooltipModule,
      RouterModule,
      MatInputModule,
      MatFormFieldModule,
      MatDatepickerModule,
      MatNativeDateModule
    ]
})
export class FinanceModule { }
  