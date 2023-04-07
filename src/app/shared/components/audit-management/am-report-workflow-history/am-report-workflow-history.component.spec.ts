import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmReportWorkflowHistoryComponent } from './am-report-workflow-history.component';

describe('AmReportWorkflowHistoryComponent', () => {
  let component: AmReportWorkflowHistoryComponent;
  let fixture: ComponentFixture<AmReportWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmReportWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmReportWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
