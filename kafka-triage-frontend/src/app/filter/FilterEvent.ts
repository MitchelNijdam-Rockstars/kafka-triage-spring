import { Filter } from "./Filter";

export class FilterEvent {
  constructor(readonly filters: Filter[] = []) {
  }
}
