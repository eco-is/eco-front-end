import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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
  typesOptions: string[] = ['RENT', 'INSURANCE', 'UTILITIES', 'OTHER'];
  displayedColumns: string[] = ['number', 'type', 'amount', 'period', 'created', 'description', 'actions'];
  dataSource: MatTableDataSource<FixedExpenses>;
  editStates: { [key: number]: boolean } = {};
  editForm = new FormGroup({
    type: new FormControl(''),
    amount: new FormControl(0, [Validators.required]),
    description: new FormControl(''),
    wage: new FormControl(0, [Validators.required]),
    workingHours: new FormControl(0, [Validators.required]),
    overtimeWage: new FormControl(0, [Validators.required]),
    overtimeHours: new FormControl(0, [Validators.required]),
  });
  page: number = 0;
  size: number = 5;
  totalExpenses = 0;
  sortField: string = 'type';
  sortDirection: string = 'asc';

  user: User | undefined;
  newFixedExpense : FixedExpenses | undefined;

  totalAmount = 0; // TODO calculate

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
      this.dataSource.data = result.content;
      this.totalExpenses = result.totalElements;
      this.calculateTotal(result.content);
    });
  }

  calculateTotal(result : FixedExpenses[]){
    // Calculate total amount after loading fixed expenses from result
    result.forEach(expense => {
      this.totalAmount += expense.amount;
    });
    
    // Round totalAmount to 4 decimal places
    this.totalAmount = parseFloat(this.totalAmount.toFixed(4));
  }

  addNewFixedExpense() : void {
    this.newFixedExpense = {
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
    };
    this.dataSource.data.unshift(this.newFixedExpense);
    this.updateDataSource(this.newFixedExpense);
    this.editStates[this.newFixedExpense.id] = !this.editStates[this.newFixedExpense.id];
    this.editFixedExpense(this.newFixedExpense);
  }
  saveNewFixedExpense(expense: FixedExpenses): void{
    // Update the expense object with values from the edit form
    expense.type = this.editForm.value.type!;
    expense.amount = this.editForm.value.amount!;
    expense.description = this.editForm.value.description!;
    
    this.financeService.createFixedExpense(expense).subscribe(
      (result) => {
        expense = result;
      }, (error) => {
        let errorMessage = 'Error while creating new fixed expense. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  editFixedExpense(expense: FixedExpenses) : void {
    this.editStates[expense.id] = !this.editStates[expense.id];
    this.editForm.patchValue({
      type: expense.type,
      amount: expense.amount,
      description: expense.description,
      wage: expense.employee.wage,
      workingHours: expense.employee.workingHours,
      overtimeWage: expense.employee.overtimeWage,
      overtimeHours: expense.overtimeHours,
    })
  }

  saveChangesToExpense(expense: FixedExpenses) : void {
    if (expense.id === 0){
      this.saveNewFixedExpense(expense);
      this.ngAfterViewInit(); // display new expense
    } else {
      if (expense.type === 'SALARY'){
        // SALARY update
        // Update the expense object with values from the edit form
        expense.description = this.editForm.value.description!;
        expense.employee.wage = this.editForm.value.wage!;
        expense.employee.workingHours = this.editForm.value.workingHours!;
        expense.employee.overtimeWage = this.editForm.value.overtimeWage!;
        expense.overtimeHours = this.editForm.value.overtimeHours!;
        
        this.financeService.updateSalaryExpense(expense).subscribe(
          (result) => {
            expense = result;
            this.updateDataSource(expense);
          }, (error) => {
            let errorMessage = 'Error while updating salary expense. Please try again.';
            this.errorMessageDisplay(error, errorMessage);
          }
        );
      } else {
        // updateFixedExpense
        // Update the expense object with values from the edit form
        expense.type = this.editForm.value.type!;
        expense.amount = this.editForm.value.amount!;
        expense.description = this.editForm.value.description!;
        
        this.financeService.updateFixedExpense(expense).subscribe(
          (result) => {
            expense = result;
            this.updateDataSource(expense);
          }, (error) => {
            let errorMessage = 'Error while updating fixed expense. Please try again.';
            this.errorMessageDisplay(error, errorMessage);
          }
        );
      }
    }
  }

  updateDataSource(expense: FixedExpenses) : void{
    this.editStates[expense.id] = !this.editStates[expense.id];
    const index = this.dataSource.data.findIndex(item => item.id === expense.id);
    if (index !== -1) {
        this.dataSource.data[index] = expense;
        this.dataSource._updateChangeSubscription(); // Notify Angular about the change
        this.loadFixedExpenses();
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
}
