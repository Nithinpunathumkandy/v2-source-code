import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreChartComponent } from './kpi-score-chart.component';

describe('KpiScoreChartComponent', () => {
  let component: KpiScoreChartComponent;
  let fixture: ComponentFixture<KpiScoreChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
