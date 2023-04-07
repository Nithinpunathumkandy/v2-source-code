import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLessonLearntDetailsLoaderComponent } from './event-lesson-learnt-details-loader.component';

describe('EventLessonLearntDetailsLoaderComponent', () => {
  let component: EventLessonLearntDetailsLoaderComponent;
  let fixture: ComponentFixture<EventLessonLearntDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLessonLearntDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLessonLearntDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
