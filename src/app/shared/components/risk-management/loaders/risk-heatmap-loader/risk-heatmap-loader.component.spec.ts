import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskHeatmapLoaderComponent } from './risk-heatmap-loader.component';

describe('RiskHeatmapLoaderComponent', () => {
  let component: RiskHeatmapLoaderComponent;
  let fixture: ComponentFixture<RiskHeatmapLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskHeatmapLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskHeatmapLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
