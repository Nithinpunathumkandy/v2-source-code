import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiWorkflowHistoryComponent } from './kpi-workflow-history.component';

describe('KpiWorkflowHistoryComponent', () => {
  let component: KpiWorkflowHistoryComponent;
  let fixture: ComponentFixture<KpiWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
