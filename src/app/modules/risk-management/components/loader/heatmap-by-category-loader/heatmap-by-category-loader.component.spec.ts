import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapByCategoryLoaderComponent } from './heatmap-by-category-loader.component';

describe('HeatmapByCategoryLoaderComponent', () => {
  let component: HeatmapByCategoryLoaderComponent;
  let fixture: ComponentFixture<HeatmapByCategoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatmapByCategoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapByCategoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
