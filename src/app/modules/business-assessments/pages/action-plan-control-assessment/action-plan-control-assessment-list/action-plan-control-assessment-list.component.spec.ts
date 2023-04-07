import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanControlAssessmentListComponent } from './action-plan-control-assessment-list.component';

describe('ActionPlanControlAssessmentListComponent', () => {
  let component: ActionPlanControlAssessmentListComponent;
  let fixture: ComponentFixture<ActionPlanControlAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanControlAssessmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanControlAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
