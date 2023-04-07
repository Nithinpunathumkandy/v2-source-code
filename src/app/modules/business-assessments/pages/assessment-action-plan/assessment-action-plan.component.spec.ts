import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentActionPlanComponent } from './assessment-action-plan.component';

describe('AssessmentActionPlanComponent', () => {
  let component: AssessmentActionPlanComponent;
  let fixture: ComponentFixture<AssessmentActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
