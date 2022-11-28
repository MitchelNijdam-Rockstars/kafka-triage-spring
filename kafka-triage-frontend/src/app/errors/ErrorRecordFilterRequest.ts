import { ErrorRecordRequest } from "./ErrorRecordRequest";

export class ErrorRecordFilterRequest {
  filters: Filter[] = [];
  pagination: ErrorRecordRequest;
}

export class Filter {
  key!: string;
  value!: string;
  operation!: RequestFilterOperation;
}


export enum RequestFilterOperation {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  REGEX = "REGEX",
}
