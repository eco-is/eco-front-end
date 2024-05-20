import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Member } from '../../administration/model/member.model';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service'
import { DateRange } from '../model/date-range.model';
import { FinanceService } from '../finance.service';
import { FixedExpenses } from '../model/fixed-expenses.model';

@Component({
  selector: 'app-fixed-expenses-history',
  templateUrl: './fixed-expenses-history.component.html',
  styleUrls: ['./fixed-expenses-history.component.scss']
})
export class FixedExpensesHistoryComponent {
  typesOptions: string[] = ['SALARY', 'RENT', 'INSURANCE', 'UTILITIES', 'OTHER'];
  employeesOptions!: Member[];
  creatorsOptions: Member[] = [];
  displayedColumns: string[] = ['number', 'type', 'amount', 'period', 'created', 'description'];
  dataSource: MatTableDataSource<FixedExpenses>;
  page: number = 0;
  size: number = 5;
  totalExpenses = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  types: string[] = [];
  period : DateRange | undefined;
  employees: number[] = [];
  creators: number[] = [];
  sortField: string = 'type';
  sortDirection: string = 'asc';

  user: User | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private administrationService : AdministrationService,
    private financeService: FinanceService,
    private router: Router, 
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.administrationService.getOrganizationMembers('','','', 0, 50, 'surname', 'asc').subscribe(
      (result) => {
        this.employeesOptions = result.content;
      }, (error) => {
        let errorMessage = 'Error while fetching organization members. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
    this.administrationService.getUserByRoles(['ACCOUNTANT']).subscribe(
      (result) => {
        this.creatorsOptions = result; 
      }, (error) => {
        let errorMessage = 'Error while fetching creators. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
    this.dataSource = new MatTableDataSource<FixedExpenses>();
    this.searchForm = this.formBuilder.group({
      types: [[]],
      startDate: [],
      endDate: [],
      employees: [[]],
      creators: [[]],
    });
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
    this.financeService.getAllFixedExpenses(
      this.period!,
      this.types,
      this.employees,
      this.creators,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<FixedExpenses>();
      this.dataSource.data = result.content;
      this.totalExpenses = result.totalElements;
    });
  }

  searchExpenses(): void {
    this.page = 0;
    this.creators = this.searchForm.get('creators')?.value;
    this.types = this.searchForm.get('types')?.value;
    
    this.period = {
      startDate: this.searchForm.get('startDate')?.value,
      endDate: this.searchForm.get('endDate')?.value,
    };
    if (this.period.startDate) {
      this.period.startDate.setHours(23, 59, 59, 999);
    }
    if (this.period.endDate) {
      this.period.endDate.setHours(23, 59, 59, 999);
    }
    this.employees = this.searchForm.get('employees')?.value;
    //this.creators = this.searchForm.get('creators')?.value;

    this.paginator.firstPage();
    this.loadFixedExpenses();
  }

  clearAll() {
    this.searchForm.reset({
      types: [[]],
      employees: [[]],
      creators: [[]],
      startDate: null,
      endDate: null,
    });
    this.types = [];
    this.period = undefined;
    this.employees = [];
    this.creators = [];
    this.paginator.firstPage();
    this.loadFixedExpenses();
  }

  lastMonthFixedExpenses() : void {
    this.router.navigate(['fixed-expenses/latest']);
  }

  errorMessageDisplay(error: any, errorMessage : string) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
}
