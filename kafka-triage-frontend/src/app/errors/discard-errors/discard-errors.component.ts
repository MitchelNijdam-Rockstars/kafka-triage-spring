import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'kt-discard-errors',
  templateUrl: './discard-errors.component.html',
  styleUrls: ['./discard-errors.component.scss']
})
export class DiscardErrorsComponent implements OnInit {

  @Input() amountOfSelectedRecords: number = 0;
  @Input() totalRecordsMatchingFilter: number = 0;
  @Input() topics: string[] = [];
  @Input() selectedOffset: number;
  @Input() selectedTopic: string;

  discardUntilOffsetForm: FormGroup;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.discardUntilOffsetForm = this.fb.group({
      offset: [this.selectedOffset || '', Validators.required],
      topic: [this.selectedTopic || '', Validators.required],
    });
  }

  close() {
    this.activeModal.close();
  }

  discardSelected() {
    console.log('TODO: discardSelectedRecords');
    this.activeModal.close();
    // TODO
  }

  discardAllForCurrentFilter() {
    console.log('TODO: discardCurrentFilterRecords');
    this.activeModal.close();
    // TODO
  }

  discardUntilOffset() {
    console.log('TODO: discardUntilOffset');
    this.activeModal.close();
    // TODO
  }
}
