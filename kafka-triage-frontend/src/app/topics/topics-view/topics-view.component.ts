import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorTopic } from "../ErrorTopic";
import { TopicService } from "../topic.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'kt-topics-view',
  templateUrl: './topics-view.component.html',
  styleUrls: ['./topics-view.component.css']
})
export class TopicsViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'lag'];
  topicsDataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private topicService: TopicService) {
  }

  ngOnInit(): void {
    this.topicService.getErrors().subscribe(topics => {
      topics.sort((a, b) => this.sortTopics(a, b));
      this.topicsDataSource.data = topics;
    });
  }

  ngAfterViewInit(): void {
    this.topicsDataSource.sort = this.sort;
  }

  // Sort topics by lag, then by name
  private sortTopics(a: ErrorTopic, b: ErrorTopic) {
    if (a.lag !== b.lag) {
      return b.lag - a.lag > 0 ? 1 : -1;
    }
    return a.name.localeCompare(b.name) > 0 ? 1 : -1;
  }

}
