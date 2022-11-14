import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Filter, FilterOperation } from "../Filter";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: 'kt-filter-option',
  templateUrl: './filter-option.component.html',
  styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent implements AfterViewInit {
  @Input() keyOptions: string[] = [];

  @Output() delete = new EventEmitter();
  @Output() filterChange = new EventEmitter<Filter>();

  @ViewChild('selectKey') selectKey: MatSelect;
  @ViewChild('selectOperation') selectOperation: MatSelect;

  form: FormGroup;
  editingKey = true;
  editingOperation = false;
  editingValue = false;
  filterOperationOptions = Object.values(FilterOperation);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      key: ['', Validators.required],
      operation: [FilterOperation.EQUALS, Validators.required],
      value: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(value => {
      if (this.form.valid) {
        this.filterChange.emit(value as Filter);
      } else {
        console.warn('Invalid form', value);
      }
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
    if (this.getValueInputType() === 'number' && isNaN(this.form.value.value)) {
      this.form.get('value')?.setValue('');
    }
    this.editingValue = true;
  }

  getValueInputType() {
    let operation = this.form.value.operation;
    if (operation === FilterOperation.EQUALS
      || operation === FilterOperation.NOT_EQUALS
      || operation === FilterOperation.REGEX) {
      return 'text';
    }
    return 'number';
  }
}
