import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';

@Component({
  selector: 'app-budget-plans-list',
  templateUrl: './budget-plans-list.component.html',
  styleUrls: ['./budget-plans-list.component.scss']
})
export class BudgetPlansListComponent {
  statusOptions: string[] = ['DRAFT', 'PENDING', 'REJECTED', 'APPROVED', 'ARCHIVED'];
  displayedColumns: string[] = ['number', 'name', 'fiscalPeriod', 'updated', 'status', 'actions'];
  dataSource: MatTableDataSource<BudgetPlan>;
  page: number = 0;
  size: number = 5;
  totalPlans = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  statuses: string[] = [];
  sortField: string = 'name';
  sortDirection: string = 'asc';

  user: User | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private financeService: FinanceService,
    private router: Router, 
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.dataSource = new MatTableDataSource<BudgetPlan>();
    this.searchForm = this.formBuilder.group({
      name: [''],
      statuses: [[]],
    });
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadBudgetPlans();
    });

    this.cdr.detectChanges();
    this.loadBudgetPlans();
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadBudgetPlans();
  }

  loadBudgetPlans(): void {
    this.financeService.getAllBudgetPlans(
      this.name,
      this.statuses,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<BudgetPlan>();
      this.dataSource.data = result.content;
      this.totalPlans = result.totalElements;
    });
  }

  searchPlans(): void {
    this.page = 0;
    this.name = this.searchForm.get('name')?.value;
    this.statuses = this.searchForm.get('statuses')?.value;

    this.paginator.firstPage();
    this.loadBudgetPlans();
  }

  viewDetails(plan: BudgetPlan): void {
    this.router.navigate(['/budget-plan-details/' + plan.id]);
  }

  closeBudgetPlan(plan: BudgetPlan): void {
    this.financeService.closeBudgetPlan(plan).subscribe(
      () => {
        this.snackBar.open('Budget plan ' + plan.name + ' closed.', 'Close', { 
          panelClass: 'green-snackbar', 
          duration: 15000 }); // Duration in milliseconds // 15s  
        this.loadBudgetPlans();
      },
      (error) => {
        let errorMessage = 'Error while closing budget plan. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error closing budget plan:', error);
      }
    );
  }

  archiveBudgetPlan(plan: BudgetPlan): void {
    this.financeService.archiveBudgetPlan(plan).subscribe(
      () => {
        this.snackBar.open('Budget plan ' + plan.name + ' archived.', 'Close', { 
          panelClass: 'green-snackbar', 
          duration: 15000 }); // Duration in milliseconds // 15s  
        this.loadBudgetPlans();
      },
      (error) => {
        let errorMessage = 'Error while archiving budget plan. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
        console.error('Error archiving budget plan:', error);
      }
    );
  }
  
  clearAll() {
    this.searchForm.reset({
      name: '',
      statuses: [[]],
    });    

    this.searchPlans();
  }

  newBudgetPlan() : void {
    this.router.navigate(['/edit-budget-plan-details']);
  }
}