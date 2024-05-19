import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Member } from '../../administration/model/member.model';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service'
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';
import { FixedExpensesEstimation } from '../model/fixed-expenses-estimation.model';

@Component({
  selector: 'app-estimate-fixed-expenses',
  templateUrl: './estimate-fixed-expenses.component.html',
  styleUrls: ['./estimate-fixed-expenses.component.scss']
})
export class EstimateFixedExpensesComponent {
  typesOptions: string[] = ['SALARY', 'RENT', 'INSURANCE', 'UTILITIES', 'OTHER'];
  employeesOptions: Member[] = [];
  displayedColumns: string[] = ['number', 'type', 'amount', 'created', 'description', 'actions'];
  dataSource: MatTableDataSource<FixedExpensesEstimation>;
  memberDataSource: MatTableDataSource<Member> = new MatTableDataSource<Member>();

  editStates: { [key: number]: boolean } = {};
  editForm = new FormGroup({
    type: new FormControl(''),
    amount: new FormControl(0, [Validators.required]),
    description: new FormControl(''),
    // wage: new FormControl(0, [Validators.required]),
    // workingHours: new FormControl(0, [Validators.required]),
    // overtimeWage: new FormControl(0, [Validators.required]),
    overtimeHours: new FormControl(0, [Validators.required]),
  });
  page: number = 0;
  size: number = 5;
  totalExpenses = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  types: string[] = [];
  employees: number[] = [];
  sortField: string = 'type';
  sortDirection: string = 'asc';

  user: User | undefined;
  budgetPlanId? : number = 0;
  budgetPlan! : BudgetPlan;
  newFixedExpense : FixedExpensesEstimation | undefined;
  totalAmount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private administrationService : AdministrationService, // get Employees and Creators
    private financeService: FinanceService,
    private router: Router, 
    private route: ActivatedRoute,
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
    });
    this.dataSource = new MatTableDataSource<FixedExpensesEstimation>();
    this.searchForm = this.formBuilder.group({
      types: [[]],
      employees: [[]],
    });

    const id = this.route.snapshot.paramMap.get('budgetPlanId');
    this.budgetPlanId = id !== null ? +id : 0;
    if (this.budgetPlanId){
      this.loadBudgetPlan(this.budgetPlanId);
      //this.loadFixedExpensesEstimation();
    }
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadFixedExpensesEstimation();
    });

    this.cdr.detectChanges();
    this.loadFixedExpensesEstimation();
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadFixedExpensesEstimation();
  }

  loadBudgetPlan(id:number): void {
    this.financeService.getBudgetPlan(id).subscribe(
      (result) => {
        this.budgetPlan = result;
      }, (error) => {
        let errorMessage = 'Error while loading budget plan. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  loadFixedExpensesEstimation(): void {
    this.financeService.getAllFixedExpensesEstimations(
      this.budgetPlanId!,
      this.types,
      this.employees,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection).subscribe(
      result => {
      this.dataSource = new MatTableDataSource<FixedExpensesEstimation>();
      this.dataSource.data = result.content;
      this.totalExpenses = result.totalElements;

      this.calculateTotal();
    });
  }

  calculateTotal(){
    // Calculate total amount after loading fixed expenses
    this.totalAmount = this.dataSource.data.reduce((total, expense) => total + expense.fixedExpense.amount, 0);
  }

  searchExpenses(): void {
    this.page = 0;
    this.types = this.searchForm.get('types')?.value;
    // TODO
    //this.employees = this.searchForm.get()

    this.paginator.firstPage();
    this.loadFixedExpensesEstimation();
  }

  clearAll() {
    this.searchForm.reset({
      types: [[]],
      employees: [[]],
    });    

    this.searchExpenses();
  }

  addNewFixedExpense():void {
    this.newFixedExpense = {
      id: 0, 
      fixedExpense: {
        id: 0, 
        type: 'OTHER',
        amount: 0, 
        description: '',
        period: { startDate: new Date(), endDate: new Date() }, // or any default period
        creator: { 
          id: this.user!.id,
          name: '', 
          surname: '',
          username: '',
          email: '',
        }, 
        createdOn: new Date(),
        employee: { 
          id: 0,
          name: '', 
          surname: '',
          username: '',
          email: '',
          wage: 0, 
          workingHours: 0,
          overtimeWage: 0, 
        },
        overtimeHours: 0 
      },
      budgetPlan: this.budgetPlan,
    };
  
    this.dataSource.data.unshift(this.newFixedExpense);
    this.updateDataSource(this.newFixedExpense);
    this.editStates[this.newFixedExpense.id] = !this.editStates[this.newFixedExpense.id];
    this.editFixedExpense(this.newFixedExpense);
  }
  saveNewFixedExpense(expense: FixedExpensesEstimation): void{
    // Update the expense object with values from the edit form
    expense.fixedExpense.type = this.editForm.value.type!;
    expense.fixedExpense.amount = this.editForm.value.amount!;
    expense.fixedExpense.description = this.editForm.value.description!;
    
    this.financeService.createFixedExpensesEstimation(expense).subscribe(
      (result) => {
        expense = result;
      }, (error) => {
        let errorMessage = 'Error while creating new fixed expense estimation. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }
  updateDataSource(expense: FixedExpensesEstimation) : void{
    this.editStates[expense.id] = !this.editStates[expense.id];
    const index = this.dataSource.data.findIndex(item => item.id === expense.id);
    if (index !== -1) {
        this.dataSource.data[index] = expense;
        this.dataSource._updateChangeSubscription(); // Notify Angular about the change
        this.calculateTotal();
    }
  }
  editFixedExpense(expense: FixedExpensesEstimation) : void {
    this.editStates[expense.id] = !this.editStates[expense.id];
    this.editForm.patchValue({
      type: expense.fixedExpense.type,
      amount: expense.fixedExpense.amount,
      description: expense.fixedExpense.description,
      // wage: expense.employee.fixedExpense.wage,
      // workingHours: expense.fixedExpense.employee.workingHours,
      // overtimeWage: expense.fixedExpense.employee.overtimeWage,
      overtimeHours: expense.fixedExpense.overtimeHours,
    })
  }

  saveChangesToExpense(expense: FixedExpensesEstimation) : void {
    if (expense.id === 0){
      this.saveNewFixedExpense(expense);
      this.ngAfterViewInit(); // display new expense
    } else {
      // updateFixedExpenseEstimation
      // Update the expense object with values from the edit form
      if (expense.fixedExpense.type !== 'SALARY') {
        expense.fixedExpense.type = this.editForm.value.type!;
        expense.fixedExpense.amount = this.editForm.value.amount!;
      }
      expense.fixedExpense.description = this.editForm.value.description!;
      //expense.fixedExpense.overtimeHours = this.editForm.value.overtimeHours!;
      this.financeService.updateFixedExpenseEstimation(expense).subscribe(
        (result) => {
          expense = result;
          this.updateDataSource(expense);
        }, (error) => {
          let errorMessage = 'Error while updating fixed expense estimation. Please try again.';
          this.errorMessageDisplay(error, errorMessage);
        }
      );
    }
  }

  errorMessageDisplay(error: any, errorMessage : string) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
  // TODO - save all changes
  saveChanges() : void {
      
  }

  
  navigateBack() : void {
    this.router.navigate(['/edit-budget-plan-details/' + this.budgetPlanId]);
  }
  navigateNext() : void {
    this.router.navigate(['/fixed-expenses-estimate/' + this.budgetPlanId]);
  }  
}
