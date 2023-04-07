import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseInfoComponent } from './test-and-exercise-info.component';

describe('TestAndExerciseInfoComponent', () => {
  let component: TestAndExerciseInfoComponent;
  let fixture: ComponentFixture<TestAndExerciseInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
