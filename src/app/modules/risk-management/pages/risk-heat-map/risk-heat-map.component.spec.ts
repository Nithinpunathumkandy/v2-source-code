import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskHeatMapComponent } from './risk-heat-map.component';

describe('RiskHeatMapComponent', () => {
  let component: RiskHeatMapComponent;
  let fixture: ComponentFixture<RiskHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskHeatMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
