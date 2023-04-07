import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentActionPlanListComponent } from './assessment-action-plan-list.component';

describe('AssessmentActionPlanListComponent', () => {
  let component: AssessmentActionPlanListComponent;
  let fixture: ComponentFixture<AssessmentActionPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentActionPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentActionPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
