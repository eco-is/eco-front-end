import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Document } from '../model/document.model'; 
import { TeamMember } from '../model/team-member.model';
import { ProjectsService } from '../projects.service';
import { Assignment } from '../model/assignment.model';

@Component({
  selector: 'app-assign-document',
  templateUrl: './assign-document.component.html',
  styleUrls: ['./assign-document.component.scss']
})
export class AssignDocumentDialogComponent implements OnInit {
  availableTeamMembers: TeamMember[] = [];
  selectedWriters: TeamMember[] = [];
  selectedReviewers: TeamMember[] = [];

  constructor(
    private projectService: ProjectsService,
    public dialogRef: MatDialogRef<AssignDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number, document: Document }
  ) {
    this.selectedWriters = data.document.writers || [];
    this.selectedReviewers = data.document.reviewers || [];
  }

  ngOnInit(): void {
    this.projectService.getTeamByProject(this.data.projectId).subscribe(
      (teamMembers: TeamMember[]) => {
        this.availableTeamMembers = teamMembers;
      },
      (error) => {
        console.error('Error fetching team members:', error);
      }
    );
  }

  assign(): void {
    const assignment: Assignment = {
      documentId: this.data.document.documentId,
      reviewerIds: this.selectedReviewers.map(reviewer => reviewer.userId),
      writerIds: this.selectedWriters.map(writer => writer.userId)
    };

    this.projectService.assignTeamMembers(this.data.projectId, assignment).subscribe(
      () => {
      },
      (error) => {
        console.error('Error assigning team members:', error);
      }
    );
  }

  onSave(): void {
    this.assign();
    this.dialogRef.close(this.data.document);
  }

  onClose(): void {
    this.dialogRef.close();
  }
  
  compareMembers(member1: TeamMember, member2: TeamMember): boolean {
    return member1 && member2 ? member1.userId === member2.userId : member1 === member2;
  }
}