import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraHeatmapComponent } from './hira-heatmap.component';

describe('HiraHeatmapComponent', () => {
  let component: HiraHeatmapComponent;
  let fixture: ComponentFixture<HiraHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraHeatmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
