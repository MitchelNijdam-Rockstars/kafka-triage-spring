export class Filter {
  key!: string;
  value!: string;
  operation!: FilterOperation;
}

export enum FilterOperation {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  REGEX = ".*",
}
