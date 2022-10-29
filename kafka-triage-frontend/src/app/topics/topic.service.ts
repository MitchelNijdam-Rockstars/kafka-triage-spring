import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { BASE_PATH_KAFKA_TRIAGE_BACKEND } from "../errors/error-record.service";
import { ErrorTopic } from "./ErrorTopic";
import { ToastService } from "../toast/toast.service";

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  baseUrl: string;

  constructor(@Optional() @Inject(BASE_PATH_KAFKA_TRIAGE_BACKEND) basePath: string,
              private http: HttpClient,
              private toastService: ToastService) {
    this.baseUrl = basePath;
  }

  getErrors(): Observable<ErrorTopic[]> {
    return this.http.get<ErrorTopic[]>(this.baseUrl + '/topics/').pipe(
      catchError((error) => {
        console.error(error);
        this.toastService.showError("Failed to retrieve topics");
        throw error;
      })
    );
  }
}
