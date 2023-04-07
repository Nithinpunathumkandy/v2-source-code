import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseComponent } from './test-and-exercise.component';

describe('TestAndExerciseComponent', () => {
  let component: TestAndExerciseComponent;
  let fixture: ComponentFixture<TestAndExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
