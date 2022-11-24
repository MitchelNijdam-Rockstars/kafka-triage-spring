import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { ErrorRecord } from "./ErrorRecord";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { ErrorRecordService } from "./error-record.service";
import { ErrorRecordRequest } from "./ErrorRecordRequest";
import { ErrorRecordFilterRequest } from "./ErrorRecordFilterRequest";

export class ErrorRecordDataSource implements DataSource<ErrorRecord> {
  private errorRecordSubject = new BehaviorSubject<ErrorRecord[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public data = this.errorRecordSubject.value;
  public total = 0;

  constructor(private errorService: ErrorRecordService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<ErrorRecord[]> {
    return this.errorRecordSubject.asObservable();
  }

  getData() : Observable<ErrorRecord[]> {
    return this.errorRecordSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.errorRecordSubject.complete();
    this.loadingSubject.complete();
  }

  loadErrorRecords(errorRequest: ErrorRecordRequest) {
    this.loadingSubject.next(true);
    this.errorService.getErrorRecords(errorRequest)
    .pipe(
      catchError(() => of(null)),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(value => {
      this.total = value?.totalElements || 0;
      this.errorRecordSubject.next(value?.content || []);
    });
  }

  loadErrorRecordsWithFilter(errorFilterRequest: ErrorRecordFilterRequest) {
    this.loadingSubject.next(true);
    this.errorService.getErrorRecordsWithFilter(errorFilterRequest)
    .pipe(
      catchError(() => of(null)),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(value => {
      this.total = value?.totalElements || 0;
      this.errorRecordSubject.next(value?.content || []);
    });
  }

}
