import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExercisesActionPlanComponent } from './test-and-exercises-action-plan.component';

describe('TestAndExercisesActionPlanComponent', () => {
  let component: TestAndExercisesActionPlanComponent;
  let fixture: ComponentFixture<TestAndExercisesActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExercisesActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExercisesActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
