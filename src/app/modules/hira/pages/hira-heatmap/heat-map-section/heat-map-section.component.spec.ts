import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapSectionComponent } from './heat-map-section.component';

describe('HeatMapSectionComponent', () => {
  let component: HeatMapSectionComponent;
  let fixture: ComponentFixture<HeatMapSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatMapSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
