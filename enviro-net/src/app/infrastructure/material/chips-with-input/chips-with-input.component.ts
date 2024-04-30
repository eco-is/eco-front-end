import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-chips-with-input',
  templateUrl: './chips-with-input.component.html',
  styleUrls: ['./chips-with-input.component.scss'],
})
export class ChipsWithInputComponent implements OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() autofillOptions: string[] = [];
  @Input() addOnBlur: boolean = false;
  @Output() itemsChangedEvent = new EventEmitter<string[]>();
  @ViewChild('itemInputField') inputField!: ElementRef<HTMLInputElement>;
  formControl = new FormControl('');
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  items: string[] = [];
  filteredAutofillOptions: Observable<string[]> | undefined;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredAutofillOptions = this.formControl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => {
        return item ? this._filter(item) : this.autofillOptions.slice();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['autofillOptions']) {
      this.formControl.setValue(null);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our item
    if (value && this.items.indexOf(value) < 0) {
      this.items.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.itemsChangedEvent.emit(this.items);
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);

      this.announcer.announce(`Removed ${item}`);

      this.itemsChangedEvent.emit(this.items);
    }
  }

  edit(item: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove item if it no longer has a name
    if (!value) {
      this.remove(item);
      return;
    }

    // Edit existing item
    const index = this.items.indexOf(item);
    if (index >= 0) {
      this.items[index] = value;

      this.itemsChangedEvent.emit(this.items);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.items.push(event.option.viewValue);
    this.inputField.nativeElement.value = '';
    this.itemsChangedEvent.emit(this.items);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autofillOptions.filter((item) =>
      item.toLowerCase().includes(filterValue)
    );
  }
}
