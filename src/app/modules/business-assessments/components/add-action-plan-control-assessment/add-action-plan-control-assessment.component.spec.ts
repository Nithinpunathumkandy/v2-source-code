import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionPlanControlAssessmentComponent } from './add-action-plan-control-assessment.component';

describe('AddActionPlanControlAssessmentComponent', () => {
  let component: AddActionPlanControlAssessmentComponent;
  let fixture: ComponentFixture<AddActionPlanControlAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActionPlanControlAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionPlanControlAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
