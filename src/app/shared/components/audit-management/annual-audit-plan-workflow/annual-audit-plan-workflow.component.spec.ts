import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualAuditPlanWorkflowComponent } from './annual-audit-plan-workflow.component';

describe('AnnualAuditPlanWorkflowComponent', () => {
  let component: AnnualAuditPlanWorkflowComponent;
  let fixture: ComponentFixture<AnnualAuditPlanWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualAuditPlanWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualAuditPlanWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
