import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLessonLearntDetailsComponent } from './event-lesson-learnt-details.component';

describe('EventLessonLearntDetailsComponent', () => {
  let component: EventLessonLearntDetailsComponent;
  let fixture: ComponentFixture<EventLessonLearntDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLessonLearntDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLessonLearntDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
