import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorRecordService } from "../error-record.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ErrorRecord } from "../ErrorRecord";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'kt-errors-view',
  templateUrl: './errors-view.component.html',
  styleUrls: ['./errors-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', padding: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('refresh', [
      state('refreshing', style({transform: 'rotate(360deg)'})),
      transition('* => refreshing', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class ErrorsViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['timestamp', 'topic', 'cause', 'value', 'offset', 'triaged'];
  errorRecordsDataSource = new MatTableDataSource();
  expandedErrorRecord: ErrorRecord | null;
  isRefreshing = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private errorService: ErrorRecordService) {
  }

  ngOnInit(): void {
    this.refreshRecords();
  }

  ngAfterViewInit(): void {
    this.errorRecordsDataSource.sort = this.sort;
  }

  refreshRecords() {
    this.isRefreshing = true;
    this.errorService.getErrorRecords().subscribe({
      next: async errorRecords => {
        errorRecords.sort((a, b) => this.sortErrorRecords(a, b));
        this.errorRecordsDataSource.data = errorRecords;

        await new Promise(f => setTimeout(f, 500)); // time for the animation to complete
        this.isRefreshing = false;
      }
    });
  }

  private sortErrorRecords(a: ErrorRecord, b: ErrorRecord) {
    return a.timestamp - b.timestamp ? -1 : 1;
  }

  getErrorCause(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-exception-cause-fqcn");
  }

  getOriginalTopic(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-original-topic");
  }

  getOriginalPartition(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-original-partition");
  }

  getOriginalOffset(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-original-offset");
  }

  getOriginalTimestamp(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-original-timestamp");
  }

  getOriginalConsumerGroup(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-original-consumer-group");
  }

  getStacktrace(errorRecord: ErrorRecord): string {
    return this.findHeader(errorRecord, "kafka_dlt-exception-stacktrace");
  }

  discardRecords() {
    console.log("Discarding all selected records");
  }

  replayRecords() {
    console.log("Replaying all selected records");
  }

  private findHeader(errorRecord: ErrorRecord, key: string) {
    return errorRecord.headers
    ?.find(header => header.key === key)?.value || '';
  }
}
