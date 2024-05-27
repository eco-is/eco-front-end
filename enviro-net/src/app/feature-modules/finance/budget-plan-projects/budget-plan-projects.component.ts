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
import { RankedProject } from '../../projects/model/ranked-project.model';
import { AdministrationService } from '../../administration/administration.service';
import { Notification } from '../../administration/model/notification.model';
import { FinanceService } from '../finance.service';
import { BudgetPlan } from '../model/budget-plan.model';
import { TotalProjectRevenue } from '../model/total-project-revenue.model';
import { Revenue } from '../model/revenue.mode';
import { ProjectBudget } from '../model/project-budget.model';

@Component({
  selector: 'app-budget-plan-projects',
  templateUrl: './budget-plan-projects.component.html',
  styleUrls: ['./budget-plan-projects.component.scss']
})
export class BudgetPlanProjectsComponent {
  totalProjectRevenue!: TotalProjectRevenue;
  displayedColumnsRevenues: string[] = ['number', 'createdOn', 'type', 'amount'];
  dataSource: MatTableDataSource<Revenue>;
  totalRevenue = 0;
  page: number = 0;
  size: number = 5;
  sortField: string = 'amount';
  sortDirection: string = 'desc';

  displayedColumnsProjects: string[] = ['number', 'name'];
  selectedProject: RankedProject | null = null;
  selectedProjectBudget: ProjectBudget | null = null;
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
    private administrationService: AdministrationService,
    private router: Router, 
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.dataSource = new MatTableDataSource<Revenue>();
    const id = this.route.snapshot.paramMap.get('budgetPlanId');
    this.budgetPlanId = id !== null ? +id : 0;
    if (this.budgetPlanId){
      this.loadBudgetPlan(this.budgetPlanId);
    }
  }

  ngAfterViewInit(): void {
    this.loadProjects();
    this.sort.direction = this.sortDirection as SortDirection;
    this.sort.active = this.sortField;

    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction as string;
      this.loadTotalProjectRevenue(this.selectedProject!);
    });
    
    this.cdr.detectChanges();
    this.loadTotalProjectRevenue(this.selectedProject!);
  }
  
  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadTotalProjectRevenue(this.selectedProject!);
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
        this.selectProject(this.ranked[0]);
      } 
      this.loadTotalProjectRevenue(this.selectedProject!);
    }, (error) => {
      let errorMessage = 'Error while loading ranked projects. Please try again.';
      this.errorMessageDisplay(error, errorMessage);
    });
  }

  selectProject(project : RankedProject): void {
    this.selectedProject = project;
    this.loadTotalProjectRevenue(this.selectedProject);
    this.loadProjectBudget(project);
  }

  loadTotalProjectRevenue(project: RankedProject): void {
    if (project) {
      const getRevenueObservable = project.type === 'INTERNAL'
        ? this.financeService.getAllInternalTotalProjectRevenue(project.id, this.page, this.size, this.sortField, this.sortDirection)
        : this.financeService.getAllExternalTotalProjectRevenue(project.id, this.page, this.size, this.sortField, this.sortDirection);
  
      getRevenueObservable.subscribe(
        (result) => {
          this.totalProjectRevenue = result;
          this.dataSource.data = this.totalProjectRevenue.content.content;
          this.totalRevenue = this.totalProjectRevenue.content.totalElements;
        }, 
        (error) => {
          let errorMessage = 'Error while loading project revenue. Please try again.';
          this.errorMessageDisplay(error, errorMessage);
        }
      );
    }
  }  

  loadProjectBudget(selectedProject: RankedProject): void{
    this.selectedProjectBudget = null;
    this.financeService.getProjectBudget(selectedProject.id).subscribe(
      (result) => {
        this.selectedProjectBudget = result;
      }, (error) => {
        if (error.status === 404) {
        let errorMessage = "Project Budget for Project " + selectedProject.name + " doesn't exist. If you would like to create it, please press save button on the bottom of the page!";
          this.errorMessageDisplay(error, errorMessage, 10000);
        } else {
          let errorMessage = 'Error while loading project budget. Please try again.';
          this.errorMessageDisplay(error, errorMessage);
        }
      });
  }

  saveProjectBudget(): void {
    if (!this.selectedProjectBudget) {
      const newProjectBudget: ProjectBudget = {
        id: 0,
        project: this.selectedProject!,
        creator: {
          id: this.user!.id,
          username: this.user!.username,
          name: '', surname: '', email: 'mail@gmail.com'
        },
        totalRevenuesAmount: this.totalProjectRevenue.totalAmount,
        totalExpensesAmount: 0
      };

      this.financeService.createProjectBudget(newProjectBudget).subscribe(
        (result) => {
          this.selectedProjectBudget = result;
          this.snackBar.open('Project budget created successfully!', 'Close', { 
            duration: 5000,
            panelClass: 'green-snackbar' });

          let title = 'New Project Budget';
          let description = 'New Project Budget created for your project: ' + this.selectedProject!.name + '.';
          this.notifyProjectManager(result, title, description);
        }, (error) => {
          let errorMessage = 'Error while creating project budget. Please try again.';
          this.errorMessageDisplay(error, errorMessage);
        }
      );
    } else {
      //this.selectedProjectBudget.totalExpensesAmount = 
      this.selectedProjectBudget.totalRevenuesAmount = this.totalProjectRevenue.totalAmount;
      this.financeService.updateProjectBudget(this.selectedProjectBudget).subscribe(
        (result) => {
          this.selectedProjectBudget = result;
          this.snackBar.open('Project budget updated successfully!', 'Close', { 
            duration: 5000,
            panelClass: 'green-snackbar' });

          let title = 'Updates on Project Budget';
          let description = 'Project Budget for your project ' + this.selectedProject!.name + ' has been updated.';
          this.notifyProjectManager(result, title, description);
        },
        (error) => {
          let errorMessage = 'Error while updating project budget. Please try again later.';
          this.errorMessageDisplay(error, errorMessage);
        }
      );      
    }
  }

  notifyProjectManager(projectBudget: ProjectBudget, title: string, description: string, link: string | undefined = undefined): void {
    const newNotification: Notification = {
      id: 0,
      createdOn: new Date(),
      user: {
        id: projectBudget.project.manager.id,
        username: projectBudget.project.manager.username,
        name: '', surname: '', email: 'mail@gmail.com'
      }, 
      title: title,
      description: description,
      read: false,
      link: link,
    };
    this.administrationService.sendNotification(newNotification).subscribe(
      (result) => {
      }, (error) => {
        let errorMessage = 'Error while creating notification for project manager. Please try again.';
        this.errorMessageDisplay(error, errorMessage);
      });
  }

  errorMessageDisplay(error: any, errorMessage : string, duration: number = 5000) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { 
      duration: duration,
      panelClass: 'green-snackbar' });
    console.error('Error :', error.error.message);
  }
 
  navigateBack() : void {
    this.router.navigate(['/fixed-expenses-estimate/' + this.budgetPlanId]);
  }
  navigateNext() : void {
    this.router.navigate(['/budget-plan-details/' + this.budgetPlanId]);
  }  
}
