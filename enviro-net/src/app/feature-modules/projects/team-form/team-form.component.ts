import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamMember } from '../model/team-member.model';
import { ProjectsService } from '../projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamMemberDialogComponent } from '../add-team-member/add-team-member.component';
import { Document } from '../model/document.model';
import { AssignDocumentDialogComponent } from '../assign-document/assign-document.component';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent implements OnInit {
  projectId?: number;

  team: TeamMember[] = [];
  displayedColumns: string[] = ['number', 'firstName', 'lastName', 'email', 'role', 'actions'];

  documents: Document[] = [];

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const projectIdParam = this.route.snapshot.paramMap.get('projectId');
    this.projectId = projectIdParam !== null ? +projectIdParam : 0;
    if (this.projectId) {
      this.getTeam();
      this.getDocuments();
    }
  }

  getTeam() {
    this.projectsService.getTeamByProject(this.projectId!).subscribe(
      (team) => {
        console.log(team);
        this.team = team;
      },
      (error) => {
        console.error('Error fetching team:', error);
      }
    );
  }

  getDocuments() {
    this.projectsService.getDocumentsByProject(this.projectId!).subscribe(
      (documents) => {
        console.log(documents);
        this.documents = documents;
      },
      (error) => {
        console.error('Error fetching documents:', error);
      }
    );
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddTeamMemberDialogComponent, {
      width: '600px',
      data: { projectId: this.projectId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getTeam()
    });
  }

  openAssignDocumentDialog(document: Document) {
    const dialogRef = this.dialog.open(AssignDocumentDialogComponent, {
      width: '600px',
      data: { projectId: this.projectId, document: document }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDocuments()
    });
  }

  removeMember(member: TeamMember) {
    this.projectsService.removeTeamMember(this.projectId!, member.id).subscribe(
      () => {
        this.getTeam()
      },
      (error) => {
        console.error('Error removing member:', error);
        if (error.status === 409) {
          this.openSnackBar('You cannot remove a team member while they are still assigned to a document.');
        }
      }
    );
  }

  navigateToPreviousPage() {
    this.router.navigate(['org/projects', this.projectId, 'documents']);
  }

  navigateToNextPage() {
    this.router.navigate(['org/projects']);
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }
}
