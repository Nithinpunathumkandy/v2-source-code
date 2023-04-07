import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmReportWorkflowComponent } from './am-report-workflow.component';

describe('AmReportWorkflowComponent', () => {
  let component: AmReportWorkflowComponent;
  let fixture: ComponentFixture<AmReportWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmReportWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmReportWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
