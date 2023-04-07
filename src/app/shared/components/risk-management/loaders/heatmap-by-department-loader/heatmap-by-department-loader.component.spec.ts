import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapByDepartmentLoaderComponent } from './heatmap-by-department-loader.component';

describe('HeatmapByDepartmentLoaderComponent', () => {
  let component: HeatmapByDepartmentLoaderComponent;
  let fixture: ComponentFixture<HeatmapByDepartmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatmapByDepartmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapByDepartmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
