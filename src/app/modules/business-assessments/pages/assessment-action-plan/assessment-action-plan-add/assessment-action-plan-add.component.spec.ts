import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentActionPlanAddComponent } from './assessment-action-plan-add.component';

describe('AssessmentActionPlanAddComponent', () => {
  let component: AssessmentActionPlanAddComponent;
  let fixture: ComponentFixture<AssessmentActionPlanAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentActionPlanAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentActionPlanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
