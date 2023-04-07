import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFinalReportWorkflowHistoryComponent } from './am-final-report-workflow-history.component';

describe('AmFinalReportWorkflowHistoryComponent', () => {
  let component: AmFinalReportWorkflowHistoryComponent;
  let fixture: ComponentFixture<AmFinalReportWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFinalReportWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFinalReportWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
