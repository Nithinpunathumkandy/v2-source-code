import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDraftReportWorkflowComponent } from './am-draft-report-workflow.component';

describe('AmDraftReportWorkflowComponent', () => {
  let component: AmDraftReportWorkflowComponent;
  let fixture: ComponentFixture<AmDraftReportWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmDraftReportWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDraftReportWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
