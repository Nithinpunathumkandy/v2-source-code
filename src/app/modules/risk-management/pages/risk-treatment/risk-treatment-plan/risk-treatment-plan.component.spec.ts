import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentPlanComponent } from './risk-treatment-plan.component';

describe('RiskTreatmentPlanComponent', () => {
  let component: RiskTreatmentPlanComponent;
  let fixture: ComponentFixture<RiskTreatmentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
