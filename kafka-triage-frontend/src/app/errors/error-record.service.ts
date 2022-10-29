import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { ErrorRecord } from "./ErrorRecord";
import { ToastService } from "../toast/toast.service";

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

  getErrorRecords(): Observable<ErrorRecord[]> {
    return this.http.get<ErrorRecord[]>(this.baseUrl + '/records/').pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to retrieve records");
        throw error;
      })
    );
  }
}
