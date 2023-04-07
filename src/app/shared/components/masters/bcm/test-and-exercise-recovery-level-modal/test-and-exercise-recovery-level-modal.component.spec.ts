import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseRecoveryLevelModalComponent } from './test-and-exercise-recovery-level-modal.component';

describe('TestAndExerciseRecoveryLevelModalComponent', () => {
  let component: TestAndExerciseRecoveryLevelModalComponent;
  let fixture: ComponentFixture<TestAndExerciseRecoveryLevelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseRecoveryLevelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseRecoveryLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
