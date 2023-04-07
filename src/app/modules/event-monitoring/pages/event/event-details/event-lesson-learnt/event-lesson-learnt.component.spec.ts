import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLessonLearntComponent } from './event-lesson-learnt.component';

describe('EventLessonLearntComponent', () => {
  let component: EventLessonLearntComponent;
  let fixture: ComponentFixture<EventLessonLearntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLessonLearntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLessonLearntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
