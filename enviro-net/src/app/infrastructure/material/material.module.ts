import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import {
  MatButton,
  MatButtonModule,
  MatFabButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChipsWithInputComponent } from './chips-with-input/chips-with-input.component';
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { TableComponent } from './table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger,
} from '@angular/material/menu';
import {
  MatRadioButton,
  MatRadioGroup,
  MatRadioModule,
} from '@angular/material/radio';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ChipsWithInputComponent, TableComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatTableModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  exports: [
    MatToolbar,
    MatButton,
    MatFormField,
    MatHint,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
    MatExpansionModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    MatSelect,
    MatOption,
    ChipsWithInputComponent,
    MatFabButton,
    TableComponent,
    MatAutocomplete,
    MatError,
    MatDialogActions,
    MatDialogClose,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatRadioButton,
    MatRadioGroup,
    MatSuffix,
    MatPrefix,
    MatMiniFabButton,
    MatCheckbox,
  ]
})
export class MaterialModule {}
