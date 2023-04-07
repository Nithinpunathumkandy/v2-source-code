import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanWorkflowCommentComponent } from './audit-plan-workflow-comment.component';

describe('AuditPlanWorkflowCommentComponent', () => {
  let component: AuditPlanWorkflowCommentComponent;
  let fixture: ComponentFixture<AuditPlanWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
