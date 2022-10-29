import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorService } from "../error.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ErrorRecord } from "../ErrorRecord";

@Component({
  selector: 'kt-errors-view',
  templateUrl: './errors-view.component.html',
  styleUrls: ['./errors-view.component.css']
})
export class ErrorsViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['timestamp', 'topic', 'partition', 'offset', 'triaged'];
  errorRecordsDataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.errorService.getErrors().subscribe({
      next: errorRecords => {
        errorRecords.sort((a, b) => this.sortErrorRecords(a, b));
        this.errorRecordsDataSource.data = errorRecords;
      }
    });
  }

  ngAfterViewInit(): void {
    this.errorRecordsDataSource.sort = this.sort;
  }

  private sortErrorRecords(a: ErrorRecord, b: ErrorRecord) {
    return a.timestamp - b.timestamp ? -1 : 1;
  }
}
