import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  ngOnInit(): void {
    if (this.showViewCol) {
      this.displayedColumns.push('view');
    }
    if (this.showDeleteCol) {
      this.displayedColumns.push('delete');
    }
  }
  @Input() dataSource: any;
  @Input() displayedColumns: string[] = [];
  @Input() showViewCol: boolean = false;
  @Input() showDeleteCol: boolean = false;
  @Output() itemViewEvent = new EventEmitter<any>();
  @Output() itemDeleteEvent = new EventEmitter<any>();

  public onView(item: any) {
    this.itemViewEvent.emit(item);
  }

  public onDelete(item: any) {
    this.itemDeleteEvent.emit(item);
  }
}
