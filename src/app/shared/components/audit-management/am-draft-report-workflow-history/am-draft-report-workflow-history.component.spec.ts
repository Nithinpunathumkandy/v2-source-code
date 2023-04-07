import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDraftReportWorkflowHistoryComponent } from './am-draft-report-workflow-history.component';

describe('AmDraftReportWorkflowHistoryComponent', () => {
  let component: AmDraftReportWorkflowHistoryComponent;
  let fixture: ComponentFixture<AmDraftReportWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmDraftReportWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDraftReportWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
