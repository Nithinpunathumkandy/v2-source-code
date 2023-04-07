import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentActionPlanHistoryComponent } from './control-assessment-action-plan-history.component';

describe('ControlAssessmentActionPlanHistoryComponent', () => {
  let component: ControlAssessmentActionPlanHistoryComponent;
  let fixture: ComponentFixture<ControlAssessmentActionPlanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentActionPlanHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentActionPlanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
