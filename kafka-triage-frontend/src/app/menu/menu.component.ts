import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kt-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input()
  collapsed = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
