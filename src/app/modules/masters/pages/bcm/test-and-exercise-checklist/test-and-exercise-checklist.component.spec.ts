import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseChecklistComponent } from './test-and-exercise-checklist.component';

describe('TestAndExerciseChecklistComponent', () => {
  let component: TestAndExerciseChecklistComponent;
  let fixture: ComponentFixture<TestAndExerciseChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
