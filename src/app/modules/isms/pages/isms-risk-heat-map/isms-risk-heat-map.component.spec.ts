import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskHeatMapComponent } from './isms-risk-heat-map.component';

describe('IsmsRiskHeatMapComponent', () => {
  let component: IsmsRiskHeatMapComponent;
  let fixture: ComponentFixture<IsmsRiskHeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskHeatMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskHeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
