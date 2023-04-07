import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseListComponent } from './test-and-exercise-list.component';

describe('TestAndExerciseListComponent', () => {
  let component: TestAndExerciseListComponent;
  let fixture: ComponentFixture<TestAndExerciseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
