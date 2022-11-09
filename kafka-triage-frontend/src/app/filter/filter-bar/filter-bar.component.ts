import { Component, OnInit } from '@angular/core';

// Inspiration: https://dribbble.com/shots/5851903-Filter-Interaction
@Component({
  selector: 'kt-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  addFilter() {
    console.log('addFilter');
  }
}
