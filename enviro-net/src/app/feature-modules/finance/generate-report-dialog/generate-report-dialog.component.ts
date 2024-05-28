import { Component, Inject, OnInit, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectsService } from '../../projects/projects.service';
import { FinanceService } from '../finance.service';
import { EducationService } from '../../education/education.service';
//import { VolunteerService }

@Component({
  selector: 'app-generate-report-dialog',
  templateUrl: './generate-report-dialog.component.html',
  styleUrls: ['./generate-report-dialog.component.scss']
})
export class GenerateReportDialogComponent implements OnInit {
  canGenerate = true;
  formGroup: FormGroup = new FormGroup({
    filename: new FormControl('', [Validators.required]),
    columns: new FormControl([], [Validators.required]),
    title: new FormControl('', [Validators.required]),
    text: new FormControl(''),
  })

  filename : string = ''; // save PDF file with this name
  columns: string[] = []; // include these columns in PDF file
  title: string = ''; // add title to PDF 
  text: string = ''; // add text description in PDF file (optional)

  constructor(
    private projectsService: ProjectsService,
    private financeService: FinanceService,
    private educationService: EducationService,
    //private volunteersService: VolunteerService,
    public dialogRef: MatDialogRef<GenerateReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      columnOptions: string[],
      data: any[], // list of objects to be included in PDF
      service: string, // "PROJECTS" / "FINANCE" / "EDUCATION" / "VOLUNTEERS"
    },
    private snackBar: MatSnackBar
  ) {
    this.formGroup.patchValue({
      filename: this.filename,
      title: this.title,
      text: '',
      columns: [],
    });
  }

  ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(() => {
      this.canGenerate = !this.formGroup.valid; 
    });
  }

  generatePDFReport(): void {
    if (this.formGroup.valid) {
      this.filename = this.formGroup.get('filename')?.value;
      this.title = this.formGroup.get('title')?.value;
      this.text = this.formGroup.get('text')?.value;
      this.columns = this.formGroup.get('columns')?.value;
      this.generate(this.data.service);
    } else {
      let message = 'Please ensure all required fields are filled and at least one column is selected.';
      this.snackBar.open(message, 'Close', { panelClass: 'green-snackbar' });  
    }
  }

  generate(option: string): void {
    switch (option) {
      case 'PROJECTS':
        // this.projectsService.generatePDFReport(this.filename, this.columns, this.title, this.text)
        //   .subscribe({
        //     next: (response) => this.dialogRef.close(response),
        //     error: (error) => this.errorMessageDisplay(error, 'Failed to generate projects report', 5000)
        //   });
        break;
      case 'FINANCE_fixed_expense':
        this.financeService.generateFixedExpensesPDF(
          this.filename, this.columns,
          this.data.data, this.title, this.text
        )
          .subscribe({
            next: (response) => this.dialogRef.close(response),
            error: (error) => this.errorMessageDisplay(error, 'Failed to generate finance report! Please try again later.', 5000)
          });
        break;
      case 'EDUCATION':
        // this.educationService.generatePDFReport(this.filename, this.columns, this.title, this.text)
        //   .subscribe({
        //     next: (response) => this.dialogRef.close(response),
        //     error: (error) => this.errorMessageDisplay(error, 'Failed to generate education report', 5000)
        //   });
        break;
      // case 'VOLUNTEERS':
      //   this.volunteersService.generatePDFReport(this.filename, this.columns, this.title, this.text)
      //     .subscribe({
      //       next: (response) => this.dialogRef.close(response),
      //       error: (error) => this.errorMessageDisplay(error, 'Failed to generate volunteers report', 5000)
      //     });
      //   break;
      default:
        this.snackBar.open('Unknown service type!', 'Close', { panelClass: 'red-snackbar', duration: 10000 });
        break;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  errorMessageDisplay(error: any, errorMessage : string, duration: number = 5000) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { 
      duration: duration,
      panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
}
