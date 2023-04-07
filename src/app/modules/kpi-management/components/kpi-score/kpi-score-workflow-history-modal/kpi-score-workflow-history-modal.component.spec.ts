import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreWorkflowHistoryModalComponent } from './kpi-score-workflow-history-modal.component';

describe('KpiScoreWorkflowHistoryModalComponent', () => {
  let component: KpiScoreWorkflowHistoryModalComponent;
  let fixture: ComponentFixture<KpiScoreWorkflowHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreWorkflowHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreWorkflowHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
