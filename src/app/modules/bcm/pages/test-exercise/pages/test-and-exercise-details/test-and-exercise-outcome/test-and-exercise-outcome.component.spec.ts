import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseOutcomeComponent } from './test-and-exercise-outcome.component';

describe('TestAndExerciseOutcomeComponent', () => {
  let component: TestAndExerciseOutcomeComponent;
  let fixture: ComponentFixture<TestAndExerciseOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
