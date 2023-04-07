import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanWorkflowPopupComponent } from './audit-plan-workflow-popup.component';

describe('AuditPlanWorkflowPopupComponent', () => {
  let component: AuditPlanWorkflowPopupComponent;
  let fixture: ComponentFixture<AuditPlanWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
