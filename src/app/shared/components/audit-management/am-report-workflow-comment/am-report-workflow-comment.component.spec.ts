import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmReportWorkflowCommentComponent } from './am-report-workflow-comment.component';

describe('AmReportWorkflowCommentComponent', () => {
  let component: AmReportWorkflowCommentComponent;
  let fixture: ComponentFixture<AmReportWorkflowCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmReportWorkflowCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmReportWorkflowCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
