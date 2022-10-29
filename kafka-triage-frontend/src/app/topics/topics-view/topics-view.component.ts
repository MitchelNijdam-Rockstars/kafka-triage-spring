import { Component, OnInit } from '@angular/core';
import { ErrorTopic } from "../ErrorTopic";
import { TopicService } from "../topic.service";

@Component({
  selector: 'kt-topics-view',
  templateUrl: './topics-view.component.html',
  styleUrls: ['./topics-view.component.css']
})
export class TopicsViewComponent implements OnInit {

  displayedColumns: string[] = ['name', 'lag'];
  topics: ErrorTopic[] = [];

  constructor(private topicService: TopicService) {
  }

  ngOnInit(): void {
    this.topicService.getErrors().subscribe(topics => this.topics = topics);
  }

}
