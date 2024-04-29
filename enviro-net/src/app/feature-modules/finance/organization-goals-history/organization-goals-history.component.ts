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
import { OrganizationGoal } from '../model/organization-goal.model';

@Component({
  selector: 'app-organization-goals-history',
  templateUrl: './organization-goals-history.component.html',
  styleUrls: ['./organization-goals-history.component.scss']
})
export class OrganizationGoalsHistoryComponent {
  displayedColumns: string[] = ['number', 'title', 'validPeriod', 'creator', 'actions'];
  dataSource: MatTableDataSource<OrganizationGoal>;
  page: number = 0;
  size: number = 5;
  totalPlans = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  title: string = '';
  sortField: string = 'title';
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
    this.dataSource = new MatTableDataSource<OrganizationGoal>();
    this.searchForm = this.formBuilder.group({
      title: [''],
      // TODO date filters
    });
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadOrganizationGoals();
    });

    this.cdr.detectChanges();
    this.loadOrganizationGoals();
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadOrganizationGoals();
  }

  loadOrganizationGoals(): void {
    this.financeService.getAllOrganizationGoals(
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<OrganizationGoal>();
      this.dataSource.data = result.content;
      this.totalPlans = result.totalElements;
    });
  }

  searchGoals(): void {
    this.page = 0;
    this.title = this.searchForm.get('title')?.value;

    this.paginator.firstPage();
    this.loadOrganizationGoals();
  }

  viewDetails(goal: OrganizationGoal): void {
    this.router.navigate(['/edit-goals/' + goal.id]);
  }

  deleteOrganizationGoal(goal: OrganizationGoal): void {
    this.financeService.deleteOrganizationGoal(goal.id).subscribe(
      () => {
        this.snackBar.open('Goal ' + goal.title + ' deleted.', 'Close', { 
          panelClass: 'green-snackbar', 
          duration: 15000 }); // Duration in milliseconds // 15s  
        this.loadOrganizationGoals();
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

  clearAll() {
    this.searchForm.reset({
      title: '',
      // TODO filters
    });    

    this.searchGoals();
  }

  newOrganizationGoal() : void {
    this.router.navigate(['/edit-goals']);
  }
}
