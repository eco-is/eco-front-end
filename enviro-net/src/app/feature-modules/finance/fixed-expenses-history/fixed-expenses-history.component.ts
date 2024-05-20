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
import { FinanceService } from '../finance.service';
import { FixedExpenses } from '../model/fixed-expenses.model';

@Component({
  selector: 'app-fixed-expenses-history',
  templateUrl: './fixed-expenses-history.component.html',
  styleUrls: ['./fixed-expenses-history.component.scss']
})
export class FixedExpensesHistoryComponent {
  typesOptions: string[] = ['SALARY', 'RENT', 'INSURANCE', 'UTILITIES', 'OTHER'];
  employeesOptions: Member[] = [];
  creatorsOptions: Member[] = [];
  displayedColumns: string[] = ['number', 'type', 'amount', 'period', 'created', 'description'];
  dataSource: MatTableDataSource<FixedExpenses>;
  memberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>();
  page: number = 0;
  size: number = 5;
  totalExpenses = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  types: string[] = [];
  employees: number[] = [];
  creators: number[] = [];
  sortField: string = 'type';
  sortDirection: string = 'asc';

  user: User | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private administrationService : AdministrationService, // get Employees and Creators
    private financeService: FinanceService,
    private router: Router, 
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    // TODO 
    this.administrationService.getOrganizationMembers(
      '','','',
      1, 50, 'name', 'asc').subscribe(result => {
        this.employeesOptions = result.content;
        console.log(this.employeesOptions); // TODO
    })
    this.dataSource = new MatTableDataSource<FixedExpenses>();
    this.searchForm = this.formBuilder.group({
      types: [[]],
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
    this.types = this.searchForm.get('types')?.value;
    // TODO
    //this.employees = this.searchForm.get()
    //this.creators = this.searchForm.get()

    this.paginator.firstPage();
    this.loadFixedExpenses();
  }

  clearAll() {
    this.searchForm.reset({
      types: [[]],
      employees: [[]],
      creators: [[]],
    });    

    this.searchExpenses();
  }

  lastMonthFixedExpenses() : void {
    this.router.navigate(['fixed-expenses/latest']);
  }
}
