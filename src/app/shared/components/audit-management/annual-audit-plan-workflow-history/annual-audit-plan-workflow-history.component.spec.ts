import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualAuditPlanWorkflowHistoryComponent } from './annual-audit-plan-workflow-history.component';

describe('AnnualAuditPlanWorkflowHistoryComponent', () => {
  let component: AnnualAuditPlanWorkflowHistoryComponent;
  let fixture: ComponentFixture<AnnualAuditPlanWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualAuditPlanWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualAuditPlanWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
