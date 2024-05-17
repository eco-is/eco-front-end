import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';
import { OrganizationGoalsSet } from '../model/organization-goals-set.model';

@Component({
  selector: 'app-budget-plan-details',
  templateUrl: './budget-plan-details.component.html',
  styleUrls: ['./budget-plan-details.component.scss']
})
export class BudgetPlanDetailsComponent {
  plan! : BudgetPlan;
  user : User | undefined;
  goalSet : OrganizationGoalsSet | undefined;
  
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
          this.snackBar.open('Error fetching budget plan details. Please try again later.', '', { 
            panelClass: 'green-snackbar', 
            duration: 3000 }); // Duration in milliseconds // 15s  
          this.router.navigate(['/budget-plans']);
        } else {
          this.getBudgetPlan(id);
        }
      });
  }

  getBudgetPlan(id : number): void {
    this.financeService.getBudgetPlan(id).subscribe(
      (result) => {
        this.plan = result;
      }, 
      (error) => {
        let errorMessage = 'Error fetching budget plan. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error fetching budget plan:', error);
      }
    );
  }

  editBudgetPlan() : void {
    this.router.navigate(['/edit-budget-plan-details/' + this.plan.id]);
  }

  isHovered = false;
  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
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
}
