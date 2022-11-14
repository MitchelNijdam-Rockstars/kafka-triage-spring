import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterEvent } from "../FilterEvent";
import { Filter } from "../Filter";
import { ToastService } from "../../toast/toast.service";

// Inspiration: https://dribbble.com/shots/5851903-Filter-Interaction
@Component({
  selector: 'kt-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent {
  @Input() keyOptions: string[] = [];

  @Output() filtersApplied = new EventEmitter<FilterEvent>();

  filters: Filter[] = [];

  constructor(private toastService: ToastService) {
  }

  addFilter() {
    this.filters.push(new Filter());
  }

  removeFilter(filter: Filter) {
    this.filters = this.filters.filter(f => f !== filter);
  }

  getKeyOptions() {
    return this.keyOptions.filter(key => !this.filters.some(f => f.key === key));
  }

  applyFilters() {
    let validFilters = this.filters.filter(f => f.key && f.operation && f.value);
    if (validFilters.length != this.filters.length) {
      this.toastService.showError('Some filters are invalid. Please fix them before applying.');
      console.warn('Some filters are invalid', this.filters);
    }
    if (validFilters.length == 0) {
      return;
    }
    this.filtersApplied.emit(new FilterEvent(this.filters));
  }

  onFilterChange($event: Filter, filter: Filter) {
    Object.assign(filter, $event);
  }
}
