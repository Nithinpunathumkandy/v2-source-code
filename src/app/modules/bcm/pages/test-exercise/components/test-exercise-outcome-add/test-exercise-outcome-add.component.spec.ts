import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestExerciseOutcomeAddComponent } from './test-exercise-outcome-add.component';

describe('TestExerciseOutcomeAddComponent', () => {
  let component: TestExerciseOutcomeAddComponent;
  let fixture: ComponentFixture<TestExerciseOutcomeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestExerciseOutcomeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestExerciseOutcomeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
