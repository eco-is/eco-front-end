import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

type DialogData = {
  lectureId: number;
};

@Component({
  selector: 'app-test-creation-modal',
  templateUrl: './test-creation-modal.component.html',
  styleUrls: ['./test-creation-modal.component.scss'],
})
export class TestCreationModalComponent {
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onAccept() {
    this.router.navigate(['create-test', this.data.lectureId]);
  }

  onDecline() {
    this.router.navigate(['my-lectures']);
  }
}
