import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-discard-errors',
  templateUrl: './discard-errors.component.html',
  styleUrls: ['./discard-errors.component.scss']
})
export class DiscardErrorsComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }

  onSubmit() {
    console.log('onSubmit');
  }
}
