import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualAuditPlanWorkflowCommentComponent } from './annual-audit-plan-workflow-comment.component';

describe('AnnualAuditPlanWorkflowCommentComponent', () => {
  let component: AnnualAuditPlanWorkflowCommentComponent;
  let fixture: ComponentFixture<AnnualAuditPlanWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualAuditPlanWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualAuditPlanWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
