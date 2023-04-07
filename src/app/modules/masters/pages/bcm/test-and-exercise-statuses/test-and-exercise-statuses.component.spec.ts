import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseStatusesComponent } from './test-and-exercise-statuses.component';

describe('TestAndExerciseStatusesComponent', () => {
  let component: TestAndExerciseStatusesComponent;
  let fixture: ComponentFixture<TestAndExerciseStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
