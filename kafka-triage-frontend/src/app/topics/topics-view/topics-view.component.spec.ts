import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsViewComponent } from './topics-view.component';

describe('TopicsViewComponent', () => {
  let component: TopicsViewComponent;
  let fixture: ComponentFixture<TopicsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
