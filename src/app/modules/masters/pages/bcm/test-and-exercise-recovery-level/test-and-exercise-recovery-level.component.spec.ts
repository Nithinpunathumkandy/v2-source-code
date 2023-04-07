import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseRecoveryLevelComponent } from './test-and-exercise-recovery-level.component';

describe('TestAndExerciseRecoveryLevelComponent', () => {
  let component: TestAndExerciseRecoveryLevelComponent;
  let fixture: ComponentFixture<TestAndExerciseRecoveryLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseRecoveryLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseRecoveryLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
