import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { BudgetPlansListComponent } from './budget-plans-list/budget-plans-list.component';

@NgModule({
    declarations: [
      BudgetPlansListComponent
  ],
    imports: [
      CommonModule,
      MaterialModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatSelectModule,
      MatTooltipModule,
      RouterModule,
    ]
})
export class FinanceModule { }
  