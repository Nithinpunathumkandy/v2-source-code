import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanControlAssessmentComponent } from './action-plan-control-assessment.component';

describe('ActionPlanControlAssessmentComponent', () => {
  let component: ActionPlanControlAssessmentComponent;
  let fixture: ComponentFixture<ActionPlanControlAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanControlAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanControlAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
