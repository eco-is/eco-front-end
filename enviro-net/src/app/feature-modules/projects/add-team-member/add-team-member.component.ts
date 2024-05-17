import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamMember } from '../model/team-member.model';
import { ProjectsService } from '../projects.service';
import { TeamMemberCreation } from '../model/team-member-creation.model';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberDialogComponent implements OnInit {
  availableMembers: TeamMember[] = [];
  selectedMembers: TeamMember[] = [];

  constructor(
    private projectService: ProjectsService,
    private dialogRef: MatDialogRef<AddTeamMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
  ) { }

  ngOnInit(): void {
    this.projectService.getAvailableMembersByProject(this.data.projectId).subscribe(
      (members) => {
        this.availableMembers = members;
      },
      (error) => {
        console.error('Error fetching available members:', error);
      }
    );
  }

  addMember(orgMember: TeamMember): void {
    const teamMember: TeamMemberCreation = {
      projectId: this.data.projectId,
      userId: orgMember.userId,
    };
    this.projectService.addTeamMember(this.data.projectId, teamMember).subscribe(
      () => {
      },
      (error) => {
        console.error('Error adding new member:', error);
      }
    );
  }

  onCancel(): void {
    this.selectedMembers.forEach(member => this.addMember(member));
    this.dialogRef.close();
  }
}