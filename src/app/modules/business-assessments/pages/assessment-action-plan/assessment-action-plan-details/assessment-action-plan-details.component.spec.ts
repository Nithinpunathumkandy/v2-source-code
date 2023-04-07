import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentActionPlanDetailsComponent } from './assessment-action-plan-details.component';

describe('AssessmentActionPlanDetailsComponent', () => {
  let component: AssessmentActionPlanDetailsComponent;
  let fixture: ComponentFixture<AssessmentActionPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentActionPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentActionPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
