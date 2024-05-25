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
import { DateRange } from '../model/date-range.model';
import { BudgetPlan } from '../model/budget-plan.model';
import { FixedExpensesEstimation } from '../model/fixed-expenses-estimation.model';

@Component({
  selector: 'app-estimate-fixed-expenses',
  templateUrl: './estimate-fixed-expenses.component.html',
  styleUrls: ['./estimate-fixed-expenses.component.scss']
})
export class EstimateFixedExpensesComponent {
  typesOptions: string[] = ['SALARY', 'RENT', 'INSURANCE', 'UTILITIES', 'OTHER'];
  displayedColumns: string[] = ['number', 'type', 'amount', 'created', 'description', 'actions'];
  dataSource: MatTableDataSource<FixedExpensesEstimation>;

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
  period : DateRange | undefined;
  employees: number[] = [];
  employeesOptions!: Member[];
  employeeMap: Map<string, number> = new Map();  // Maps name to ID
  employeeNames: string[] = []; // Holds employee names for autofill
  selectedEmployeeNames: string[] = []; // Holds selected employee names
  unselectedEmployeeNames: string[] = []; // Holds unselected employee names

  sortField: string = 'type';
  sortDirection: string = 'asc';

  user: User | undefined;
  budgetPlanId? : number = 0;
  budgetPlan! : BudgetPlan;
  canEdit : boolean = false;
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
    this.administrationService.getOrganizationMembers('', '', '', 0, 50, 'surname', 'asc').subscribe(result => {
        this.employeesOptions = result.content;
        this.employeeNames = this.employeesOptions.map(member => `${member.name} ${member.surname}`);
        this.unselectedEmployeeNames = [...this.employeeNames];
        this.employeesOptions.forEach(member => {
          this.employeeMap.set(`${member.name} ${member.surname}`, member.id);
        });
    }, (error) => {
      let errorMessage = 'Error while fetching organization members. Please try again.';
      this.errorMessageDisplay(error, errorMessage);
    });
    this.dataSource = new MatTableDataSource<FixedExpensesEstimation>();
    this.searchForm = this.formBuilder.group({
      types: [[]],
      startDate: [],
      endDate: [],
    });

    const id = this.route.snapshot.paramMap.get('budgetPlanId');
    this.budgetPlanId = id !== null ? +id : 0;
    if (this.budgetPlanId){
      this.loadBudgetPlan(this.budgetPlanId);
      this.generateExpensesEstimation();
    }
  }

  generateExpensesEstimation() : void {
    this.financeService.generateFixedExpensesEstimationsForBudgetPlan(this.budgetPlanId!).subscribe(
      result => {
      this.calculateTotal(result);
      }, (error) => {
        let errorMessage = 'Error while generating Fixed Expenses Estimation. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }
  calculateTotal(result : FixedExpensesEstimation[]) : void{
    // Calculate total amount after loading fixed expenses from result
    result.forEach(expense => {
      this.totalAmount += expense.fixedExpense.amount;
    });
    
    // Round totalAmount to 4 decimal places
    this.totalAmount = parseFloat(this.totalAmount.toFixed(4));
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
  updateEmployeesByName(employeeNames: string[]) {
    this.selectedEmployeeNames = employeeNames;
    this.unselectedEmployeeNames = this.employeeNames.filter(name => !this.selectedEmployeeNames.includes(name));
    
    this.employees = employeeNames.map(name => this.employeeMap.get(name)!).filter(id => id !== undefined);
    this.searchExpenses();
  }


  loadBudgetPlan(id:number): void {
    this.financeService.getBudgetPlan(id).subscribe(
      (result) => {
        this.budgetPlan = result;
        if (this.budgetPlan.status === 'DRAFT' || this.budgetPlan.status === 'PENDING'){
          this.canEdit = true;
        }
      }, (error) => {
        let errorMessage = 'Error while loading budget plan. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  loadFixedExpensesEstimation(): void {
    this.financeService.getAllFixedExpensesEstimations(
      this.budgetPlanId!,
      this.period!,
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
    });
  }

  
  searchExpenses(): void {
    this.page = 0;
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

    this.paginator.firstPage();
    this.loadFixedExpensesEstimation();
  }

  clearAll() {
    this.searchForm.reset({
      types: [[]],
      startDate: null,
      endDate: null,
    });    
    this.types = [];
    this.period = undefined;
    this.employees = [];
    this.paginator.firstPage();
    this.loadFixedExpensesEstimation();
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
    this.generateExpensesEstimation();
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
          this.generateExpensesEstimation();
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
    this.router.navigate(['/budget-plan-details/' + this.budgetPlanId]);
  }
  navigateNext() : void {
    this.router.navigate(['/projects-budgeting/' + this.budgetPlanId]);
  }  
}
