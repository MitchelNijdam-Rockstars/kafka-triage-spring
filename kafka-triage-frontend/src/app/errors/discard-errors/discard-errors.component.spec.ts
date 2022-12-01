import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardErrorsComponent } from './discard-errors.component';

describe('DiscardErrorsComponent', () => {
  let component: DiscardErrorsComponent;
  let fixture: ComponentFixture<DiscardErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscardErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
