import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from '../model/project.model';
import { ProjectsService } from '../projects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent {
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
    private router: Router
  ) {
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

  createProject(): void {
    this.router.navigate(['org/projects/form']);
  }

  viewProject(project: Project): void {
    // this.projectService.removeProject(project.id).subscribe(
    //   () => {
    //     this.loadProjects();
    //   },
    //   (error) => {
    //     console.error('Error removing project:', error);
    //   }
    // );
  }

  editProject(project: Project): void {
    // this.projectService.removeProject(project.id).subscribe(
    //   () => {
    //     this.loadProjects();
    //   },
    //   (error) => {
    //     console.error('Error removing project:', error);
    //   }
    // );
  }

  removeProject(project: Project): void {
    // this.projectService.removeProject(project.id).subscribe(
    //   () => {
    //     this.loadProjects();
    //   },
    //   (error) => {
    //     console.error('Error removing project:', error);
    //   }
    // );
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
