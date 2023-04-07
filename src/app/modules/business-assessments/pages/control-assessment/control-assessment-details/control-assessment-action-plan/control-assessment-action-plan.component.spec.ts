import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanComponent } from './control-assessment-action-plan.component';

describe('ControlAssessmentActionPlanComponent', () => {
  let component: ControlAssessmentActionPlanComponent;
  let fixture: ComponentFixture<ControlAssessmentActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
