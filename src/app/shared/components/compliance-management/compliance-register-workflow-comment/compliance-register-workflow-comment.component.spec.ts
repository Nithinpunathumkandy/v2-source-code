import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterWorkflowCommentComponent } from './compliance-register-workflow-comment.component';

describe('ComplianceRegisterWorkflowCommentComponent', () => {
  let component: ComplianceRegisterWorkflowCommentComponent;
  let fixture: ComponentFixture<ComplianceRegisterWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
