import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFinalReportWorkflowComponent } from './am-final-report-workflow.component';

describe('AmFinalReportWorkflowComponent', () => {
  let component: AmFinalReportWorkflowComponent;
  let fixture: ComponentFixture<AmFinalReportWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFinalReportWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFinalReportWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
