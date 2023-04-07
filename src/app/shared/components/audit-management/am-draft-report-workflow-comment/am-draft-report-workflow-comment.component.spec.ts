import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDraftReportWorkflowCommentComponent } from './am-draft-report-workflow-comment.component';

describe('AmDraftReportWorkflowCommentComponent', () => {
  let component: AmDraftReportWorkflowCommentComponent;
  let fixture: ComponentFixture<AmDraftReportWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmDraftReportWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDraftReportWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
