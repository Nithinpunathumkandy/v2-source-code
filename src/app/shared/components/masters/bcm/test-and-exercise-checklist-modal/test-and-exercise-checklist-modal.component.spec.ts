import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExerciseChecklistModalComponent } from './test-and-exercise-checklist-modal.component';

describe('TestAndExerciseChecklistModalComponent', () => {
  let component: TestAndExerciseChecklistModalComponent;
  let fixture: ComponentFixture<TestAndExerciseChecklistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExerciseChecklistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExerciseChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
