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
import { OrganizationGoalsSet } from '../model/organization-goals-set.model';


@Component({
  selector: 'app-organization-goals-edit',
  templateUrl: './organization-goals-edit.component.html',
  styleUrls: ['./organization-goals-edit.component.scss']
})
export class OrganizationGoalsEditComponent {
  goalSet: OrganizationGoalsSet | undefined;
  goal: OrganizationGoal | undefined;
  user : User | undefined;
  canEdit : boolean = false; 
  canPublish : boolean = false;
  canAddNewGoal : boolean = true;

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

      // existing goalSet
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.goalSet = navigation.extras.state['goalSet'];
        //console.log(this.goalSet);
        this.goal! = this.goalSet!.goals[0];
        this.seeGoal(this.goal);
      } else { // create new goalSet
        this.goalSet = {
          validPeriod: { startDate: new Date(), endDate: undefined },
          goals: [],
          status: 'DRAFT'
        };
        this.goal = {
          id: 0,
          title: '',
          description: '',
          rationale: '',
          priority: 1,
          status: 'DRAFT',
          creator: { id: this.user?.id || 0, username: this.user?.username || '', name: '', surname: '', email: '' },
          validPeriod: { startDate: new Date(), endDate: undefined }
        };
      }
      this.setFlags();
  }

  seeGoal(goal: OrganizationGoal): void {
    this.goal = goal;
    this.formGroup.patchValue({
      title: this.goal.title,
      description: this.goal.description,
      rationale: this.goal.rationale,
      priority: this.goal.priority,
    });
  }
  setFlags() : void{
    if (this.goalSet?.status === 'ARCHIVED'){
      this.canEdit = false;
    } else {
      this.canEdit = true;
    }
    if( this.goalSet?.status === 'DRAFT' &&
        this.goalSet?.goals.length! >= 3 && this.goalSet?.goals.length! <= 5) {
      this.canPublish = true;
    } else {
      this.canPublish = false;
    }
    if(this.goalSet?.status === 'DRAFT' && this.goalSet?.goals.length! < 5) {
      this.canAddNewGoal = true;
    } else {
      this.canAddNewGoal = false;
    }
  }

  clear() : void{
    this.setFlags();
    this.goal = {
      id: 0,
      title: '',
      description: '',
      rationale: '',
      priority: 1,
      status: 'DRAFT',
      creator: { id: this.user?.id || 0, username: this.user?.username || '', name: '', surname: '', email: '' },
      validPeriod: { startDate: new Date(), endDate: undefined }
    };
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      rationale: new FormControl(''),
      priority: new FormControl(1)
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
    if (this.goal?.status === 'DRAFT' && this.goal.id === 0) {
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
        status: 'DRAFT',
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
          this.goalSet?.goals.push(this.goal);
          this.setFlags();  // Update the canAddNewGoal and canPublish flags
          this.getOrganizationGoal(this.goal.id);
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
      this.goal!.title = this.formGroup.value.title!;
      this.financeService.updateOrganizationGoal(this.goal!).subscribe(
        () => {
          this.snackBar.open(this.goal!.title + ' updated!', '', { 
            panelClass: 'green-snackbar', 
            duration: 5000 }); // Duration in milliseconds // 5s  
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
  
  deleteOrganizationGoal(goal: OrganizationGoal): void {
    this.financeService.deleteOrganizationGoal(goal.id).subscribe(
      () => {
        // Remove the goal from the goalSet.goals array
        const index = this.goalSet?.goals.findIndex(g => g.id === goal.id);
        if (index !== undefined && index > -1) {
          this.goalSet?.goals.splice(index, 1);
        }
        this.setFlags();  // Update the canAddNewGoal and canPublish flags
        this.snackBar.open('Goal ' + goal.title + ' deleted.', 'Close', { 
          panelClass: 'green-snackbar', 
          duration: 15000 }); // Duration in milliseconds // 15s  
        },
      (error) => {
        let errorMessage = 'Error while deleting organization goal. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error deleting organization goal:', error);
      }
    );
  }

  publish(goalSet : OrganizationGoalsSet) : void{
    this.financeService.publishOrganizationGoalsSet(goalSet).subscribe(
      (result) => {
        this.goalSet = result;
        this.snackBar.open('Goal set published', 'Close', { 
          panelClass: 'green-snackbar', 
          duration: 5000 }); // Duration in milliseconds // 5s  
        this.router.navigate(['/goals']);
      },
      (error) => {
        let errorMessage = 'Error while publishing organization goals set. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error while publishing organization goals set:', error);
      }
    )
  }
}
