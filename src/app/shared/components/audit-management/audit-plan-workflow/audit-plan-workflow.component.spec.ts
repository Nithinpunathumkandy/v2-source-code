import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanWorkflowComponent } from './audit-plan-workflow.component';

describe('AuditPlanWorkflowComponent', () => {
  let component: AuditPlanWorkflowComponent;
  let fixture: ComponentFixture<AuditPlanWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
