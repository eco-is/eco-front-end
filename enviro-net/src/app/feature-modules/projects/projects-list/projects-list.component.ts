import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from '../model/project.model';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {
  userId: number;

  displayedColumns: string[] = ['number', 'name', 'status', 'actions', 'createButton'];
  dataSource: MatTableDataSource<Project>;
  page: number = 0;
  size: number = 5;
  totalProjects = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  status: string = '';
  sortField: string = 'name';
  sortDirection: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectsService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    authService: AuthService
  ) {
    this.userId = authService.user$.value.id;
    console.log(this.userId)
    this.dataSource = new MatTableDataSource<Project>();
    this.searchForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      email: ['']
    });
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
  
  isManager(project: Project): boolean {
    return this.userId === project.manager.id;
  }

  create(): void {
    this.router.navigate(['org/projects/form']);
  }

  // TODO: go to project by clicking on the row(after it's done)
  view(project: Project): void {
    // this.projectService.removeProject(project.id).subscribe(
    //   () => {
    //     this.loadProjects();
    //   },
    //   (error) => {
    //     console.error('Error removing project:', error);
    //   }
    // );
  }

  edit(project: Project): void {
    this.router.navigate(['org/projects', project.id, 'form']);
  }

  discard(project: Project): void {
    const confirmed = window.confirm('Are you sure you want to discard this project?');
    if (confirmed) {
      this.remove(project);
    }
  }

  archive(project: Project): void {
    const confirmed = window.confirm('Are you sure you want to archive this project?');
    if (confirmed) {
      this.remove(project);
    }
  }

  remove(project: Project) {
    this.projectService.removeProject(project.id).subscribe(
      () => {
        this.loadProjects();
      },
      (error) => {
        console.error('Error removing project:', error);
      }
    );
  }

  loadProjects(): void {
    this.projectService.getProjects(
      this.name,
      this.status,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<Project>();
      this.dataSource.data = result.content;
      this.totalProjects = result.totalElements;
    });
  }

  searchProjects(): void {
    this.page = 0;
    this.name = this.searchForm.get('name')?.value;

    this.paginator.firstPage();
    this.loadProjects();
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadProjects();
  }

  clearAll() {
    this.searchForm.reset({
      name: '',
      surname: '',
      email: ''
    });

    this.searchProjects();
  }
}
