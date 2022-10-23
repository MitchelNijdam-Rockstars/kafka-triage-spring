import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ErrorRecord } from "./ErrorRecord";

export const BASE_PATH_KAFKA_TRIAGE_BACKEND = new InjectionToken<string>('basePath');

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  baseUrl: string;

  constructor(@Optional() @Inject(BASE_PATH_KAFKA_TRIAGE_BACKEND) basePath: string, private http: HttpClient) {
    this.baseUrl = basePath;
  }

  getErrors(): Observable<ErrorRecord[]> {
    return this.http.get<ErrorRecord[]>(this.baseUrl + '/records');
  }
}
