import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { FinanceService } from '../finance.service';
import { Revenue } from '../model/revenue.mode';
import { GenerateReportDialogComponent } from '../generate-report-dialog/generate-report-dialog.component';

@Component({
  selector: 'app-revenue-history',
  templateUrl: './revenue-history.component.html',
  styleUrls: ['./revenue-history.component.scss']
})
export class RevenueHistoryComponent {
  typesOptions : string[] = ['PROJECT_REVENUE', 'PROJECT_DONATION', 'LECTURE_REVENUE', 'LECTURE_DONATION', 'DONATION'];
  // [
  //   { display: 'Project Revenue', value: 'PROJECT_REVENUE' },
  //   { display: 'Project Donation', value: 'PROJECT_DONATION' },
  //   { display: 'Lecture Revenue', value: 'LECTURE_REVENUE' },
  //   { display: 'Lecture Donation', value: 'LECTURE_DONATION' },
  //   { display: 'Donation', value: 'DONATION' }
  // ];
  displayedColumns: string[] = ['number', 'createdOn', 'type', 'amount'];
  dataSource: MatTableDataSource<Revenue>;
  page: number = 0;
  size: number = 5;
  totalRevenue = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  types: string[] = [];
  startDate : Date | undefined;
  endDate : Date | undefined;
  aboveAmount : number = 0;
  belowAmount : number = 0;
  
  sortField: string = '';
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
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.dataSource = new MatTableDataSource<Revenue>();
    this.searchForm = this.formBuilder.group({
      types: [[]],
      startDate: [],
      endDate: [],
      aboveAmount: null,
      belowAmount: null,
    });
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadRevenues();
    });

    this.cdr.detectChanges();
    this.loadRevenues();
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadRevenues();
  }

  loadRevenues(): void {
    let startDateString = '';
    let endDateString = '';
    if (this.startDate) {
      startDateString = this.formatDateToCustomString(this.startDate);
    } 
    if (this.endDate) {
      endDateString = this.formatDateToCustomString(this.endDate);
    }
    this.financeService.getAllRevenues(
      this.types,
      startDateString,
      endDateString,
      this.aboveAmount,
      this.belowAmount,
      this.page, this.size, this.sortField, this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<Revenue>();
      this.dataSource.data = result.content;
      this.totalRevenue = result.totalElements;
    });  
  }

  searchRevenue(): void {
    this.page = 0;
    this.types = this.searchForm.get('types')?.value;
    this.startDate = this.searchForm.get('startDate')?.value;
    this.endDate = this.searchForm.get('endDate')?.value;
    if (this.searchForm.get('aboveAmount')?.value !== null) {
      this.aboveAmount = this.searchForm.get('aboveAmount')?.value; 
    }
    if (this.searchForm.get('belowAmount')?.value !== null) {
      this.belowAmount = this.searchForm.get('belowAmount')?.value;
    }
    
    // TODO dates hours
    if (this.startDate) {
      this.startDate.setHours(23, 59, 59, 999);
    }
    if (this.endDate) {
      this.endDate.setHours(23, 59, 59, 999);
    }
    console.log(this.startDate?.toISOString())

    this.paginator.firstPage();
    this.loadRevenues();
  }

  onGeneratePDF(): void {
    this.page = 0;
    this.types = this.searchForm.get('types')?.value;
    this.startDate = this.searchForm.get('startDate')?.value;
    this.endDate = this.searchForm.get('endDate')?.value;
    if (this.searchForm.get('aboveAmount')?.value !== null) {
      this.aboveAmount = this.searchForm.get('aboveAmount')?.value; 
    }
    if (this.searchForm.get('belowAmount')?.value !== null) {
      this.belowAmount = this.searchForm.get('belowAmount')?.value;
    }
    
    if (this.startDate) {
      this.startDate.setHours(23, 59, 59, 999);
    }
    if (this.endDate) {
      this.endDate.setHours(23, 59, 59, 999);
    }
    this.paginator.firstPage();
    
    let startDateString = '';
    let endDateString = '';
    if (this.startDate) {
      startDateString = this.formatDateToCustomString(this.startDate);
    } 
    if (this.endDate) {
      endDateString = this.formatDateToCustomString(this.endDate);
    }
    this.financeService.getAllRevenues(
      this.types,
      startDateString, endDateString,
      this.aboveAmount, this.belowAmount,
      this.page, 50/*this.size*/, this.sortField, this.sortDirection
    ).subscribe(result => {
      this.dataSource.data = result.content;
      this.totalRevenue = result.totalElements;
      this.openGenerateReportDialog(result.content);
    });  
  }

  openGenerateReportDialog(revenues: Revenue[]): void {
    let list : string[] = ["number", "id", "type", "amount", "createdOn", "project", "donator"];
    const dialogRef = this.dialog.open(GenerateReportDialogComponent, {
      width: '600px',
      data: {
        columnOptions: list,
        data: revenues,
        service: 'FINANCE_revenue'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let message = 'PDF generated!'
        this.snackBar.open(message, 'Close', { panelClass: 'green-snackbar', duration: 5000 });  
      }
    });
  }

  clearAll() {
    this.searchForm.reset({
      types: [[]],
      startDate: null,
      endDate: null,
      aboveAmount: null,
      belowAmount: null,
    });
    this.types = [];
    this.startDate = undefined;
    this.endDate = undefined;
    this.aboveAmount = 0;
    this.belowAmount = 0;
    
    this.paginator.firstPage();
    this.loadRevenues();
  }
  
  formatDateToCustomString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0') + '000';

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return formattedDate;
  }

  errorMessageDisplay(error: any, errorMessage : string, duration: number = 5000) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { 
      duration: duration,
      panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
}
