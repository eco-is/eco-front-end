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

@NgModule({
    declarations: [
      BudgetPlansListComponent,
      BudgetPlanDetailsComponent,
      BudgetPlanDetailsEditComponent
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
  