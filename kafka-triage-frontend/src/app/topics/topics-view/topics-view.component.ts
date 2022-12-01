import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorTopic } from "../ErrorTopic";
import { TopicService } from "../topic.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'kt-topics-view',
  templateUrl: './topics-view.component.html',
  styleUrls: ['./topics-view.component.scss'],
  animations: [
    trigger('refresh', [
      state('refreshing', style({transform: 'rotate(360deg)'})),
      transition('* => refreshing', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
})
export class TopicsViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'lag'];
  topicsDataSource = new MatTableDataSource();
  isRefreshing = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private topicService: TopicService) {
  }

  ngOnInit(): void {
    this.refreshTopics();
  }

  ngAfterViewInit(): void {
    this.topicsDataSource.sort = this.sort;
  }

  // Sort topics by lag, then by name
  refreshTopics() {
    this.isRefreshing = true;
    this.topicService.getTopics().subscribe(async topics => {
      topics.sort((a, b) => this.sortTopics(a, b));
      this.topicsDataSource.data = topics;

      await new Promise(f => setTimeout(f, 500)); // time for the animation to complete
      this.isRefreshing = false;
    });
  }

  private sortTopics(a: ErrorTopic, b: ErrorTopic) {
    if (a.lag !== b.lag) {
      return b.lag - a.lag > 0 ? 1 : -1;
    }
    return a.name.localeCompare(b.name) > 0 ? 1 : -1;
  }
}
