import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanWorkflowHistoryComponent } from './audit-plan-workflow-history.component';

describe('AuditPlanWorkflowHistoryComponent', () => {
  let component: AuditPlanWorkflowHistoryComponent;
  let fixture: ComponentFixture<AuditPlanWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
