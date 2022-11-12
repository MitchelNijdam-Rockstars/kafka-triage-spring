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

  @Input() keyOptions: string[] = [];

  @Output()
  delete = new EventEmitter();

  @ViewChild('selectKey') selectKey: MatSelect;
  @ViewChild('selectOperation') selectOperation: MatSelect;
  @ViewChild('selectValue') selectValue: MatSelect;

  form: FormGroup;
  editingKey = false;
  editingOperation = false;
  editingValue = false;
  filterOperationOptions = Object.values(FilterOperation);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      key: ['', Validators.required],
      operation: [FilterOperation.EQUALS, Validators.required],
      value: ['', Validators.required]
    });
  }

  removeThisFilter() {
    this.delete.emit();
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  editKey() {
    this.editingKey = true;
    setTimeout(() => this.selectKey.open());
  }

  editOperation() {
    this.editingOperation = true;
    setTimeout(() => this.selectOperation.open());
  }
}
