import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseActionPlanStatusComponent } from './test-and-exercise-action-plan-status.component';

describe('TestAndExerciseActionPlanStatusComponent', () => {
  let component: TestAndExerciseActionPlanStatusComponent;
  let fixture: ComponentFixture<TestAndExerciseActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
