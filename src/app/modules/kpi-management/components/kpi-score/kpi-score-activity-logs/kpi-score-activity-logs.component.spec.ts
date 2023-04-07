import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreActivityLogsComponent } from './kpi-score-activity-logs.component';

describe('KpiScoreActivityLogsComponent', () => {
  let component: KpiScoreActivityLogsComponent;
  let fixture: ComponentFixture<KpiScoreActivityLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreActivityLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreActivityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
