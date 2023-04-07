import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFinalReportWorkflowCommentComponent } from './am-final-report-workflow-comment.component';

describe('AmFinalReportWorkflowCommentComponent', () => {
  let component: AmFinalReportWorkflowCommentComponent;
  let fixture: ComponentFixture<AmFinalReportWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFinalReportWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFinalReportWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
