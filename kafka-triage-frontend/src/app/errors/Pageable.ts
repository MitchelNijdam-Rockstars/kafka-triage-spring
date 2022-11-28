import { SortDirection } from "./ErrorRecordRequest";

export class Pageable {
  page: number;
  size: number;
  sortKey: string;
  sortDirection: SortDirection;
}
