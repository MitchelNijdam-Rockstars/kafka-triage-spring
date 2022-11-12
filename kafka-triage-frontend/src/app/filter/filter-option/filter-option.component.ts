import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FilterOperation } from "../Filter";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'kt-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent implements AfterViewInit {

  @Input() keyOptions: string[] = [];

  @Output()
  delete = new EventEmitter();

  @ViewChild('selectKey') selectKey: MatSelect;
  @ViewChild('selectOperation') selectOperation: MatSelect;

  form: FormGroup;
  editingKey = true;
  editingOperation = false;
  editingValue = false;
  FilterOperation = FilterOperation;
  filterOperationOptions = Object.values(FilterOperation);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      key: ['', Validators.required],
      operation: [FilterOperation.EQUALS, Validators.required],
      value: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.selectKey.open(), 100);
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

  onKeyChange() {
    this.editingKey = false;
    this.editingOperation = true
    setTimeout(() => this.selectOperation.open(), 100);
  }

  onOperationChange() {
    this.editingOperation = false;
    this.editingValue = true;
  }

  getValueInputType() {
    let operation = this.form.get('operation')?.value;
    if (operation === FilterOperation.EQUALS
      || operation === FilterOperation.NOT_EQUALS
      || operation === FilterOperation.REGEX) {
      return 'text';
    }
    return 'number';
  }
}
