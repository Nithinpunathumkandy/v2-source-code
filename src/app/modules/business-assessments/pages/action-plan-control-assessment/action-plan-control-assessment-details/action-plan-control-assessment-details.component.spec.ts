import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanControlAssessmentDetailsComponent } from './action-plan-control-assessment-details.component';

describe('ActionPlanControlAssessmentDetailsComponent', () => {
  let component: ActionPlanControlAssessmentDetailsComponent;
  let fixture: ComponentFixture<ActionPlanControlAssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanControlAssessmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanControlAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
