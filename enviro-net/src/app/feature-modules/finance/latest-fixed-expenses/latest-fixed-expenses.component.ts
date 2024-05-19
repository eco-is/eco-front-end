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
import { FixedExpenses } from '../model/fixed-expenses.model';

@Component({
  selector: 'app-latest-fixed-expenses',
  templateUrl: './latest-fixed-expenses.component.html',
  styleUrls: ['./latest-fixed-expenses.component.scss']
})
export class LatestFixedExpensesComponent {
  displayedColumns: string[] = ['number', 'type', 'amount', 'period', 'created', 'description'];
  dataSource: MatTableDataSource<FixedExpenses>;
  page: number = 0;
  size: number = 5;
  totalExpenses = 0;
  sortField: string = 'type';
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
    this.dataSource = new MatTableDataSource<FixedExpenses>();
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadFixedExpenses();
    });

    this.cdr.detectChanges();
    this.loadFixedExpenses();
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadFixedExpenses();
  }

  loadFixedExpenses(): void {
    this.financeService.lastMonthSalaryExpenses(
      this.user!.id,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<FixedExpenses>();
      this.dataSource.data = result.content;
      this.totalExpenses = result.totalElements;
    })
  }

  newFixedExpense() : void {
    // TODO add new row that can be edited and saved

  }

  saveChanges() : void {
    
  }
}
