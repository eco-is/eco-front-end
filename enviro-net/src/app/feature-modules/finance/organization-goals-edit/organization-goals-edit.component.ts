import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FinanceService } from '../finance.service';
import { Accountant } from '../model/accountant.model';
import { DateRange } from '../model/date-range.model';
import { OrganizationGoal } from '../model/organization-goal.model';


@Component({
  selector: 'app-organization-goals-edit',
  templateUrl: './organization-goals-edit.component.html',
  styleUrls: ['./organization-goals-edit.component.scss']
})
export class OrganizationGoalsEditComponent {
  goal: OrganizationGoal | undefined;
  user : User | undefined;

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    rationale: new FormControl(''),
    priority: new FormControl(1)
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
      this.route.params.subscribe(params => {
      let id = params['id'] || null;
      if (!id) {
        this.goal!.creator.id = this.user!.id;
        this.goal!.creator.username = this.user!.username;
      } else {
        this.getOrganizationGoal(id);
      }
    });
  }

  getOrganizationGoal(id : number): void {
    this.financeService.getOrganizationGoal(id).subscribe(
      (result) => {
        this.goal = result;
        this.formGroup.patchValue({
          title: this.goal.title,
          description: this.goal.description,
          rationale: this.goal.rationale,
          priority: this.goal.priority,
        });
      }, 
      (error) => {
        let errorMessage = 'Error fetching organization goal. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error fetching organization goal:', error);
      }
    );
  }

  saveChanges() : void {
    if (this.goal === undefined) {
      let dateRange : DateRange = {
        startDate: new Date(),
        endDate: new Date(),
      }
      let user : Accountant = {
        id: this.user!.id,
        username: this.user!.username,
        name: '',
        surname: "",
        email: ""
      }
      let newGoal : OrganizationGoal = {
        id: 0,
        title: this.formGroup.value.title!,
        description: this.formGroup.value.description!,
        rationale: this.formGroup.value.rationale!,
        priority: this.formGroup.value.priority!,
        creator: user,
        validPeriod: dateRange
      }
      this.goal = newGoal;
      this.financeService.createOrganizationGoal(this.goal!).subscribe(
        (result) => {
          this.goal = result;
          this.snackBar.open(this.goal!.title + ' created!', '', { 
            panelClass: 'green-snackbar', 
            duration: 5000 }); // Duration in milliseconds // 5s  
          this.router.navigate(['/goals']);
        }, 
        (error) => {
          let errorMessage = 'Error creating organization goal. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
          console.error('Error creating organization goal:', error);
        }
      );
    } else {
      this.financeService.updateOrganizationGoal(this.goal!).subscribe(
        () => {
          this.snackBar.open(this.goal!.title + ' updated!', '', { 
            panelClass: 'green-snackbar', 
            duration: 5000 }); // Duration in milliseconds // 5s  
            this.router.navigate(['/goals']);
        }, 
        (error) => {
          let errorMessage = 'Error updating organization goal. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
          console.error('Error updating organization goal:', error);
        }
      );
    }
  }
}
