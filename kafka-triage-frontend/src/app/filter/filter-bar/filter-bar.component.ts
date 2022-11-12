import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterEvent } from "../FilterEvent";
import { Filter } from "../Filter";

// Inspiration: https://dribbble.com/shots/5851903-Filter-Interaction
@Component({
  selector: 'kt-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
  @Input()
  keyOptions: string[] = [];

  @Output()
  filterChange = new EventEmitter<FilterEvent>();

  filters: Filter[] = [];

  addFilter() {
    this.filters.push(new Filter());
  }

  removeFilter(filter: Filter) {
    this.filters = this.filters.filter(f => f !== filter);
  }

  getKeyOptions() {
    return this.keyOptions.filter(key => !this.filters.some(f => f.key === key));
  }
}
