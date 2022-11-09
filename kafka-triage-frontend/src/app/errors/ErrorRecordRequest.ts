export class ErrorRecordRequest {
  // page & sort
  page: number = 0;
  size: number = 10;
  sortDirection: SortDirection = SortDirection.DESC;
  sortKey: string = "timestamp";

  // filters
  topic?: string;
}

export enum SortDirection {
  ASC = "ASC", DESC = "DESC"
}
