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
import { AdministrationService } from '../../administration/administration.service';
import { FinanceService } from '../finance.service';
import { DateRange } from '../model/date-range.model';
import { OrganizationGoal } from '../model/organization-goal.model';
import { OrganizationGoalsSet } from '../model/organization-goals-set.model';

@Component({
  selector: 'app-organization-goals-history',
  templateUrl: './organization-goals-history.component.html',
  styleUrls: ['./organization-goals-history.component.scss']
})
export class OrganizationGoalsHistoryComponent {
  displayedColumns: string[] = ['number', 'goals', 'validPeriod', 'status','actions'];
  dataSource: MatTableDataSource<OrganizationGoalsSet>;
  statusOptions: string[] = ['DRAFT', 'VALID', 'ARCHIVED'];
  page: number = 0;
  size: number = 5;
  totalGoals = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  title: string = '';
  statuses: string[] = [];
  period : DateRange | undefined;
  creators: number[] = [];
  creatorsOptions!: Member[];
  creatorMap: Map<string, number> = new Map();  // Maps name to ID
  creatorNames: string[] = []; // Holds creator names for autofill
  selectedCreatorNames: string[] = []; // Holds selected creator names
  unselectedCreatorNames: string[] = []; // Holds unselected creator names
  
  sortField: string = 'title';
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
    this.administrationService.getUserByRoles(['BOARD_MEMBER']).subscribe(
      (result) => {
        this.creatorsOptions = result; 
        this.creatorNames = this.creatorsOptions.map(member => `${member.name} ${member.surname}`);
        this.unselectedCreatorNames = [...this.creatorNames];
        this.creatorsOptions.forEach(member => {
          this.creatorMap.set(`${member.name} ${member.surname}`, member.id);
        });
      }, (error) => {
        let errorMessage = 'Error while fetching creators. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
    this.dataSource = new MatTableDataSource<OrganizationGoalsSet>();
    this.searchForm = this.formBuilder.group({
      title: [''],
      statuses: [[]],
      startDate: [],
      endDate: [],
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
  updateCreatorsByName(creatorNames: string[]) {
    this.selectedCreatorNames = creatorNames;
    this.unselectedCreatorNames = this.creatorNames.filter(name => !this.selectedCreatorNames.includes(name));
    
    this.creators = creatorNames.map(name => this.creatorMap.get(name)!).filter(id => id !== undefined);
    this.searchGoals();
  }

  loadOrganizationGoals(): void {
    this.financeService.getAllOrganizationGoals(
      this.title,
      this.period!,
      this.statuses,
      this.creators,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<OrganizationGoalsSet>();
      this.dataSource.data = result.content;
      this.totalGoals = result.totalElements;
    });
  }

  searchGoals(): void {
    this.page = 0;
    this.title = this.searchForm.get('title')?.value;
    this.statuses = this.searchForm.get('statuses')?.value;
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
    this.loadOrganizationGoals();
  }
  
  clearAll() {
    this.searchForm.reset({
      title: '',
      statuses: [[]],
      startDate: null,
      endDate: null,
    });
    this.statuses = [];
    this.period = undefined;
    this.creators = [];
    this.paginator.firstPage();
    this.loadOrganizationGoals();
  }

  viewDetails(goalSet: OrganizationGoalsSet): void {
    this.router.navigate(['/edit-goals'], { state: { goalSet: goalSet } });
  }

  newOrganizationGoal() : void {
    this.router.navigate(['/edit-goals']);
  }

  errorMessageDisplay(error: any, errorMessage : string) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
}
