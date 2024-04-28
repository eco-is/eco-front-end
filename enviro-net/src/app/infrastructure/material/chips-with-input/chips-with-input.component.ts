import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-chips-with-input',
  templateUrl: './chips-with-input.component.html',
  styleUrls: ['./chips-with-input.component.scss'],
})
export class ChipsWithInputComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() autofillOptions: string[] = [];
  @Output() itemsChangedEvent = new EventEmitter<string[]>();
  @ViewChild('itemInputField') inputField!: ElementRef<HTMLInputElement>;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  items: string[] = [];

  announcer = inject(LiveAnnouncer);

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
}
