import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';
import { Accountant } from '../model/accountant.model';
import { Employee } from '../model/employee.model';
import { DateRange } from '../model/date-range.model';
import { OrganizationGoalsSet } from '../model/organization-goals-set.model';

@Component({
  selector: 'app-budget-plan-details-edit',
  templateUrl: './budget-plan-details-edit.component.html',
  styleUrls: ['./budget-plan-details-edit.component.scss']
})
export class BudgetPlanDetailsEditComponent {
  plan : BudgetPlan | undefined;
  user : User | undefined;
  goalSet : OrganizationGoalsSet | undefined;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  });
  
  constructor(
    private authService: AuthService, 
    private financeService: FinanceService,
    private route: ActivatedRoute,
    private router: Router, 
    private snackBar: MatSnackBar) {
      this.authService.user$.subscribe((user) => {
        this.user = user;
      });
      this.getCurrentGoals();
      this.route.params.subscribe(params => {
      let id = params['id'] || null;
      if (!id) {
        this.plan!.author.id = this.user!.id;
        this.plan!.author.username = this.user!.username;
      } else {
        this.getBudgetPlan(id);
      }
    });
  }

  getBudgetPlan(id : number): void {
    this.financeService.getBudgetPlan(id).subscribe(
      (result) => {
        this.plan = result;
        this.formGroup.patchValue({
          name: this.plan.name,
          description: this.plan.description,
          startDate: this.plan.fiscalDateRange.startDate.toString(),
          endDate: this.plan.fiscalDateRange.endDate!.toString(),
        });
      }, 
      (error) => {
        let errorMessage = 'Error fetching budget plan. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error fetching budget plan:', error);
      }
    );
  }

  saveChanges() : void {
    if (this.plan === undefined) {
      const start = new Date(this.formGroup.value.startDate!);
      const end = new Date(this.formGroup.value.endDate!);
      let dateRange : DateRange = {
        startDate: start,
        endDate: end,
      }
      let accountant : Employee = {
        id: this.user!.id,
        username: this.user!.username,
        name: '',
        surname: "",
        email: "",
        wage: 0, 
        workingHours: 0,
        overtimeWage: 0,
      }
      let newPlan : BudgetPlan = {
        id: 0,
        name: this.formGroup.value.name!,
        description: this.formGroup.value.description!,
        status: '',
        lastUpdatedOnDate: new Date(),
        fiscalDateRange: dateRange,
        author: accountant
      }
      this.plan = newPlan;

      this.financeService.createBudgetPlan(this.plan!).subscribe(
        (result) => {
          this.plan = result;
          this.snackBar.open(this.plan!.name + ' created!', '', { 
            panelClass: 'green-snackbar', 
            duration: 5000 }); // Duration in milliseconds // 5s  
          this.router.navigate(['/budget-plan-details/' + this.plan!.id]);
        }, 
        (error) => {
          let errorMessage = 'Error creating budget plan. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
          console.error('Error creating budget plan:', error);
        }
      );
    } else {
      const start = new Date(this.formGroup.value.startDate!);
      const end = new Date(this.formGroup.value.endDate!);
      let dateRange : DateRange = {
        startDate: start, endDate: end,
      }
      this.plan.fiscalDateRange = dateRange;
      this.plan.description = this.formGroup.value.description!;
      this.plan.name = this.formGroup.value.name!;

      this.financeService.updateBudgetPlan(this.plan!).subscribe(
        () => {
          this.snackBar.open(this.plan!.name + ' updated!', '', { 
            panelClass: 'green-snackbar', 
            duration: 5000 }); // Duration in milliseconds // 5s  
          this.router.navigate(['/budget-plan-details/' + this.plan!.id]);
        }, 
        (error) => {
          let errorMessage = 'Error updating budget plan. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
          console.error('Error updating budget plan:', error);
        }
      );
    }
  }

  isValidDate() : boolean {
    const start = new Date(this.formGroup.value.startDate!);
    const end = new Date(this.formGroup.value.endDate!);
    const currentDate = new Date();
    if (start <= currentDate || end <= currentDate){
      return false;
    }
    if (start >= end) {
      // Check if the start date is before the end date
      return false;
    }
    return true;
  }

  getCurrentGoals() : void{
    this.financeService.getCurrentOrganizationGoals().subscribe(
      (result) => {
        this.goalSet = result;
      }, 
      (error) => {
        let errorMessage = 'Error fetching current organization goals. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error fetching current organization goals:', error);
      }
    );
  }

  navigateNext() : void {
    this.router.navigate(['/fixed-expenses-estimate/' + this.plan!.id]);
  }
}
