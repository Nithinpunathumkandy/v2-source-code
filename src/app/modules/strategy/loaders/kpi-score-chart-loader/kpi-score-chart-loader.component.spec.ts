import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreChartLoaderComponent } from './kpi-score-chart-loader.component';

describe('KpiScoreChartLoaderComponent', () => {
  let component: KpiScoreChartLoaderComponent;
  let fixture: ComponentFixture<KpiScoreChartLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreChartLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreChartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
