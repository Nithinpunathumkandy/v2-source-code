import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseDetailsComponent } from './test-and-exercise-details.component';

describe('TestAndExerciseDetailsComponent', () => {
  let component: TestAndExerciseDetailsComponent;
  let fixture: ComponentFixture<TestAndExerciseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
