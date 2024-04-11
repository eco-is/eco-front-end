import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from '../administration.service';
import { Member } from '../model/member.model';
import { RoleOrdinals } from '../model/role.model';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent {
  displayedColumns: string[] = ['number', 'surname', 'email', 'role', 'status', 'actions'];
  dataSource: MatTableDataSource<Member>;
  page: number = 0;
  size: number = 5;
  totalMembers = 0;

  showFilter: boolean = false;
  searchForm: FormGroup;
  name: string = '';
  surname: string = '';
  email: string = '';
  sortField: string = 'surname';
  sortDirection: string = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdministrationService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<Member>();
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
      this.loadMembers();
    });

    this.cdr.detectChanges();
    this.loadMembers();
  }


  loadMembers(): void {
    this.adminService.getOrganizationMembers(
      this.name,
      this.surname,
      this.email,
      this.page,
      this.size,
      this.sortField,
      this.sortDirection
    ).subscribe(result => {
      this.dataSource = new MatTableDataSource<Member>();
      this.dataSource.data = result.content;
      this.totalMembers = result.totalElements;
    });
  }

  searchMembers(): void {
    this.page = 0;
    this.name = this.searchForm.get('name')?.value;
    this.surname = this.searchForm.get('surname')?.value;
    this.email = this.searchForm.get('email')?.value;

    this.paginator.firstPage();
    this.loadMembers();
  }

  onPageChange(event: PageEvent) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.loadMembers();
  }

  removeMember(member: Member): void {
    this.adminService.removeOrganizationMember(member.id).subscribe(
      () => {
        this.loadMembers();
      },
      (error) => {
        console.error('Error removing member:', error);
      }
    );
  }

  clearAll() {
    this.searchForm.reset();
    this.searchMembers();
  }
}
