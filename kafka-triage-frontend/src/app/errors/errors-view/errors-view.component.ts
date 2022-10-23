import { Component, OnInit } from '@angular/core';
import { ErrorService } from "../error.service";
import { ErrorRecord } from "../ErrorRecord";

@Component({
  selector: 'kt-errors-view',
  templateUrl: './errors-view.component.html',
  styleUrls: ['./errors-view.component.css']
})
export class ErrorsViewComponent implements OnInit {

  displayedColumns: string[] = ['timestamp', 'topic', 'partition', 'offset', 'triaged'];
  errorRecords: ErrorRecord[] = [];

  constructor(private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.errorService.getErrors().subscribe({
      next: errorRecords => {
        console.table(errorRecords);
        this.errorRecords = errorRecords}
    });
  }
}
