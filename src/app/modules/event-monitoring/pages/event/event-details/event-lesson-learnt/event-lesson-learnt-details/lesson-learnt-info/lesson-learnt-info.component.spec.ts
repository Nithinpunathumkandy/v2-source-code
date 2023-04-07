import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonLearntInfoComponent } from './lesson-learnt-info.component';

describe('LessonLearntInfoComponent', () => {
  let component: LessonLearntInfoComponent;
  let fixture: ComponentFixture<LessonLearntInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonLearntInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonLearntInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
