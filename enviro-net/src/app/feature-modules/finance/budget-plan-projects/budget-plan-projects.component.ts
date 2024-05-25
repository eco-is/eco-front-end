import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ProjectsService } from '../../projects/projects.service';
import { Project } from '../../projects/model/project.model';
import { RankedProject } from '../../projects/model/ranked-project.model';
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';

@Component({
  selector: 'app-budget-plan-projects',
  templateUrl: './budget-plan-projects.component.html',
  styleUrls: ['./budget-plan-projects.component.scss']
})
export class BudgetPlanProjectsComponent {
  displayedColumns: string[] = ['number', 'name'];
  dataSource: MatTableDataSource<Project>;
  page: number = 0;
  size: number = 5;
  sortField: string = 'type';
  sortDirection: string = 'desc';
  totalExpenses = 0;

  selectedProject: RankedProject | null = null;
  ranked: RankedProject[] = [];

  user: User | undefined;
  budgetPlanId? : number = 0;
  budgetPlan! : BudgetPlan;
  canEdit : boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthService,
    private projectService: ProjectsService,
    private financeService: FinanceService,
    private router: Router, 
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.dataSource = new MatTableDataSource<Project>();
    const id = this.route.snapshot.paramMap.get('budgetPlanId');
    this.budgetPlanId = id !== null ? +id : 0;
    if (this.budgetPlanId){
      this.loadBudgetPlan(this.budgetPlanId);
    }
  }

  ngAfterViewInit(): void {
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadProjects();
    });

    this.cdr.detectChanges();
    this.loadProjects();
    
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadProjects();
  }
  isHovered = false;
  toggleHover(hovered: boolean) {
    this.isHovered = hovered;
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

  loadProjects(): void {
    this.projectService.getRankedProjects().subscribe(
      result => {
      this.ranked = result;
      if (this.ranked.length > 0) {
        this.selectedProject = this.ranked[0];
      } 
    });
  }

  selectProject(project : RankedProject): void {
    this.selectedProject = project;
  }

  errorMessageDisplay(error: any, errorMessage : string) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
 
  navigateBack() : void {
    this.router.navigate(['/fixed-expenses-estimate/' + this.budgetPlanId]);
  }
  navigateNext() : void {
    this.router.navigate(['/budget-plan-details/' + this.budgetPlanId]);
  }  
}
