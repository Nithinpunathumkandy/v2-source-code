import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreWorkflowModalComponent } from './kpi-score-workflow-modal.component';

describe('KpiScoreWorkflowModalComponent', () => {
  let component: KpiScoreWorkflowModalComponent;
  let fixture: ComponentFixture<KpiScoreWorkflowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreWorkflowModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreWorkflowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
