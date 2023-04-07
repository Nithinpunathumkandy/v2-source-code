import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanUpdateStatusComponent } from './control-assessment-action-plan-update-status.component';

describe('ControlAssessmentActionPlanUpdateStatusComponent', () => {
  let component: ControlAssessmentActionPlanUpdateStatusComponent;
  let fixture: ComponentFixture<ControlAssessmentActionPlanUpdateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentActionPlanUpdateStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentActionPlanUpdateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
