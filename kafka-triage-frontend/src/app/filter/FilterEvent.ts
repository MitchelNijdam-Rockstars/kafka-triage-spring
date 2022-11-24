import { Filter, FilterOperation } from "./Filter";
import { ErrorRecordFilterRequest, RequestFilterOperation } from "../errors/ErrorRecordFilterRequest";

export class FilterEvent {
  constructor(readonly filters: Filter[] = []) {
  }

  toFilterRequest(): ErrorRecordFilterRequest {
    let filterRequest = new ErrorRecordFilterRequest();
    filterRequest.filters = this.filters.map(f => {
      return {key: f.key, value: f.value, operation: this.operationToRequestOperation(f.operation)};
    });
    return filterRequest;
  }

  private operationToRequestOperation(operation: FilterOperation): RequestFilterOperation {
    switch (operation) {
      case FilterOperation.EQUALS:
        return RequestFilterOperation.EQUALS;
      case FilterOperation.NOT_EQUALS:
        return RequestFilterOperation.NOT_EQUALS;
      case FilterOperation.GREATER_THAN:
        return RequestFilterOperation.GREATER_THAN;
      case FilterOperation.GREATER_THAN_OR_EQUAL:
        return RequestFilterOperation.GREATER_THAN_OR_EQUAL;
      case FilterOperation.LESS_THAN:
        return RequestFilterOperation.LESS_THAN;
      case FilterOperation.LESS_THAN_OR_EQUAL:
        return RequestFilterOperation.LESS_THAN_OR_EQUAL;
      case FilterOperation.REGEX:
        return RequestFilterOperation.REGEX;
    }
  }
}

