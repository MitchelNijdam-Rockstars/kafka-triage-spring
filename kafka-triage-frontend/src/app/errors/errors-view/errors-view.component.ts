import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorRecordService } from "../error-record.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ErrorRecord } from "../ErrorRecord";

@Component({
  selector: 'kt-errors-view',
  templateUrl: './errors-view.component.html',
  styleUrls: ['./errors-view.component.css']
})
export class ErrorsViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['timestamp', 'topic', 'cause', 'value', 'offset', 'triaged'];
  errorRecordsDataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private errorService: ErrorRecordService) {
  }

  ngOnInit(): void {
    this.errorService.getErrorRecords().subscribe({
      next: errorRecords => {
        console.table(errorRecords);
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

  getErrorCause(errorRecord: ErrorRecord): string {
    if (errorRecord.headers && errorRecord.headers.length > 0) {
      const causeHeader = errorRecord.headers.find(header => header.key === "kafka_dlt-exception-cause-fqcn");
      if (causeHeader) {
        return causeHeader.value;
      }
    }
    return '';
  }
}
