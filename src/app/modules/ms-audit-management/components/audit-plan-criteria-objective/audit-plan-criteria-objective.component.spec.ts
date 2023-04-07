import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanCriteriaObjectiveComponent } from './audit-plan-criteria-objective.component';

describe('AuditPlanCriteriaObjectiveComponent', () => {
  let component: AuditPlanCriteriaObjectiveComponent;
  let fixture: ComponentFixture<AuditPlanCriteriaObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanCriteriaObjectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanCriteriaObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
