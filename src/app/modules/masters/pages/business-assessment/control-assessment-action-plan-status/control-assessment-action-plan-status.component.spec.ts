import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanStatusComponent } from './control-assessment-action-plan-status.component';

describe('ControlAssessmentActionPlanStatusComponent', () => {
  let component: ControlAssessmentActionPlanStatusComponent;
  let fixture: ComponentFixture<ControlAssessmentActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
