import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Filter, FilterOperation } from "../Filter";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'kt-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent {

  @Input() filter: Filter;
  @Input() keyOptions: string[] = [];

  @Output()
  delete = new EventEmitter<Filter>();

  @ViewChild('keySelect') keySelect: MatSelect;

  form: FormGroup;
  editingKey = true;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      key: ['Choose key', Validators.required],
      operation: [FilterOperation.EQUALS, Validators.required],
      value: ['', Validators.required]
    });
  }

  removeThisFilter() {
    this.delete.emit(this.filter);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  editKey() {
    this.editingKey = true;
    setTimeout(() => this.keySelect.open());
  }
}
