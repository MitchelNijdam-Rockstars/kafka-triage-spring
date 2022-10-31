import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorRecordService } from "../error-record.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ErrorRecord } from "../ErrorRecord";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { ToastService } from "../../toast/toast.service";
import { ActivatedRoute } from "@angular/router";
import { ErrorRecordFilter } from "../ErrorRecordFilter";

@Component({
  selector: 'kt-errors-view',
  templateUrl: './errors-view.component.html',
  styleUrls: ['./errors-view.component.scss'],
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

  displayedColumns: string[] = ['select', 'timestamp', 'topic', 'cause', 'value', 'offset', 'triaged'];
  errorRecordsDataSource = new MatTableDataSource<ErrorRecord>();
  expandedErrorRecord: ErrorRecord | null;
  selection = new SelectionModel<ErrorRecord>(true, []);
  isRefreshing = false;

  private errorFilter?: ErrorRecordFilter;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private errorService: ErrorRecordService,
              private toastService: ToastService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.queryParams
    .subscribe((params: any) => {
        if (params && params.topic) {
          this.errorFilter = {
            topic: params.topic
          }
        } else {
          this.errorFilter = undefined;
        }

        this.refreshRecords();
      }
    );
  }

  ngAfterViewInit(): void {
    this.errorRecordsDataSource.sort = this.sort;
  }

  refreshRecords() {
    this.isRefreshing = true;
    this.errorService.getErrorRecords(this.errorFilter).subscribe({
      next: async errorRecords => {
        errorRecords.sort((a, b) => this.sortErrorRecords(a, b));
        this.errorRecordsDataSource.data = errorRecords;

        await new Promise(f => setTimeout(f, 500)); // time for the animation to complete
        this.isRefreshing = false;
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.errorRecordsDataSource.data.filter(r => !r.triaged).length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.errorRecordsDataSource.data.filter(r => !r.triaged));
  }

  checkboxLabel(row?: ErrorRecord): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
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
    const hasSelection = this.selection.selected.length > 0;
    if (!hasSelection) {
      this.toastService.showInfo("No records selected");
      return;
    }
    if (confirm("Are you sure you want to discard all selected records?")) {
      this.errorService.discard(this.selection.selected.map(r => r.id)).subscribe({
        next: () => {
          this.refreshRecords();
          this.selection.clear();
        }
      });
    }
  }

  replayRecords() {
    const hasSelection = this.selection.selected.length > 0;
    if (!hasSelection) {
      this.toastService.showInfo("No records selected");
      return;
    }

    if (confirm("Are you sure you want to replay all selected records?")) {
      this.errorService.replay(this.selection.selected.map(r => r.id)).subscribe({
        next: () => {
          this.refreshRecords();
          this.selection.clear();
        }
      });
    }
  }

  createFilterLabel() {
    if (this.errorFilter) {
      return Object.entries(this.errorFilter)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`).join(", ");
    }
    return "None";
  }

  private sortErrorRecords(a: ErrorRecord, b: ErrorRecord) {
    return a.timestamp - b.timestamp ? -1 : 1;
  }

  private findHeader(errorRecord: ErrorRecord, key: string) {
    return errorRecord.headers
    ?.find(header => header.key === key)?.value || '';
  }
}
