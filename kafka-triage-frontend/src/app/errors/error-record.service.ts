import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { ErrorRecord } from "./ErrorRecord";
import { ToastService } from "../toast/toast.service";
import { ErrorRecordRequest } from "./ErrorRecordRequest";
import { RemoveNull } from "../helpers/remove-null";
import { PageResponse } from "./PageResponse";
import { ErrorRecordFilterRequest } from "./ErrorRecordFilterRequest";

export const BASE_PATH_KAFKA_TRIAGE_BACKEND = new InjectionToken<string>('basePath');

@Injectable({
  providedIn: 'root'
})
export class ErrorRecordService {
  baseUrl: string;

  constructor(@Optional() @Inject(BASE_PATH_KAFKA_TRIAGE_BACKEND) basePath: string,
              private http: HttpClient,
              private toastService: ToastService) {
    this.baseUrl = basePath;
  }

  getErrorRecords(errorFilter: ErrorRecordRequest): Observable<PageResponse<ErrorRecord[]>> {
    RemoveNull.removeNulls(errorFilter);
    let options = {params: <HttpParams>(<unknown>errorFilter)};
    return this.http.get<PageResponse<ErrorRecord[]>>(this.baseUrl + '/records', options).pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to retrieve records");
        throw error;
      })
    );
  }

  getErrorRecordsWithFilter(errorFilter: ErrorRecordFilterRequest): Observable<PageResponse<ErrorRecord[]>> {
    RemoveNull.removeNulls(errorFilter);
    return this.http.post<PageResponse<ErrorRecord[]>>(this.baseUrl + '/records/filter', errorFilter).pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to retrieve records");
        throw error;
      })
    );
  }

  discard(ids: number[]) {
    return this.http.post(this.baseUrl + '/records/discard', ids).pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to discard records");
        throw error;
      })
    );
  }

  replay(ids: number[]) {
    return this.http.post(this.baseUrl + '/records/replay', ids).pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to replay records");
        throw error;
      })
    );
  }
}
