import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseAddComponent } from './test-and-exercise-add.component';

describe('TestAndExerciseAddComponent', () => {
  let component: TestAndExerciseAddComponent;
  let fixture: ComponentFixture<TestAndExerciseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
