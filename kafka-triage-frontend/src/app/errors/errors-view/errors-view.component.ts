import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorRecordService } from "../error-record.service";
import { MatSort } from "@angular/material/sort";
import { ErrorRecord } from "../ErrorRecord";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { ToastService } from "../../toast/toast.service";
import { ActivatedRoute } from "@angular/router";
import { ErrorRecordRequest, SortDirection } from "../ErrorRecordRequest";
import { MatPaginator } from "@angular/material/paginator";
import { ErrorRecordDataSource } from "../ErrorRecordDataSource";
import { merge, tap } from "rxjs";
import { FilterEvent } from "../../filter/FilterEvent";
import { ErrorRecordFilterRequest } from "../ErrorRecordFilterRequest";
import { Pageable } from "../Pageable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DiscardErrorsComponent } from "../discard-errors/discard-errors.component";
import { TopicService } from "../../topics/topic.service";

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
  dataSource: ErrorRecordDataSource;
  expandedErrorRecord: ErrorRecord | null;
  selection = new SelectionModel<ErrorRecord>(true, []);
  isRefreshing = false;

  private errorRequest = new ErrorRecordRequest();
  private filterRequest = new ErrorRecordFilterRequest();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private errorService: ErrorRecordService,
              private topicService: TopicService,
              private toastService: ToastService,
              private modalService: NgbModal,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dataSource = new ErrorRecordDataSource(this.errorService);

    this.route.queryParams
    .subscribe((params: any) => {
        if (params && params.topic) {
          this.errorRequest.topic = params.topic;
          // TODO: set filter in filter bar
        } else {
          this.errorRequest.topic = undefined;
        }
        this.refreshRecords();
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.getData().subscribe({
      next: (_) => {
        this.paginator.length = this.dataSource.total;
      }
    });

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.refreshRecords())
    ).subscribe();
  }

  refreshRecords() {
    let pageable = this.getPageable();
    this.errorRequest = pageable;

    if (this.filterRequest.filters.length > 0) {
      this.dataSource.loadErrorRecordsWithFilter(this.filterRequest, pageable);
    } else {
      this.dataSource.loadErrorRecords(this.errorRequest);
    }
  }

  private getPageable(): Pageable {
    let pageable = new Pageable();

    if (this.paginator) {
      pageable.size = this.paginator.pageSize;
      pageable.page = this.paginator.pageIndex;
    }
    if (this.sort) {
      pageable.sortKey = this.sort.active;
      pageable.sortDirection = this.sort.direction.toUpperCase() as SortDirection;
    }
    return pageable;
  }

  checkboxLabel(row: ErrorRecord): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  openDiscardModal() {
    let modal = this.modalService.open(DiscardErrorsComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modal.componentInstance.amountOfSelectedRecords = this.selection.selected.length;
    modal.componentInstance.totalRecordsMatchingFilter = this.dataSource.total;

    // if one option is selected, get the offset and topic from the selected record and set it in the modal
    if (this.selection.selected.length == 1) {
      let selectedRecord = this.selection.selected[0];
      modal.componentInstance.selectedOffset = selectedRecord.offset;
      modal.componentInstance.selectedTopic = selectedRecord.topic;
    }

    this.topicService.getTopics().subscribe({
      next: (topics) => {
        modal.componentInstance.topics = topics.filter(t => t.lag > 0).map(t => t.name);
      }
    });
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
    if (this.errorRequest) {
      return Object.entries(this.errorRequest)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`).join(", ");
    }
    return "None";
  }

  private findHeader(errorRecord: ErrorRecord, key: string) {
    return errorRecord.headers
    ?.find(header => header.key === key)?.value || '';
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

  onFiltersApplied(filterEvent: FilterEvent) {
    this.filterRequest = filterEvent.toFilterRequest();
    this.refreshRecords();
    // TODO: add filter config in URL (maybe as Base64 encoded json?)
    // so it is a sharable link
  }

  getFilterKeys() {
    return this.displayedColumns.filter(c => c !== 'select');
  }
}
