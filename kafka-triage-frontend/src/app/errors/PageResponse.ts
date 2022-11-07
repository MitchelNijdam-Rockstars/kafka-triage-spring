export class PageResponse<T> {
  content: T;
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
  first: boolean;
  last: boolean;
}
