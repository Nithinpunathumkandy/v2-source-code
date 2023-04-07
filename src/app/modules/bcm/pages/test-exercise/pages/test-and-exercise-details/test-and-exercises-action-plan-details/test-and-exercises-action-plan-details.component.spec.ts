import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAndExercisesActionPlanDetailsComponent } from './test-and-exercises-action-plan-details.component';

describe('TestAndExercisesActionPlanDetailsComponent', () => {
  let component: TestAndExercisesActionPlanDetailsComponent;
  let fixture: ComponentFixture<TestAndExercisesActionPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAndExercisesActionPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAndExercisesActionPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
