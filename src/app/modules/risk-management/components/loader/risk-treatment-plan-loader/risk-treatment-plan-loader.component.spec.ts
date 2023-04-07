import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentPlanLoaderComponent } from './risk-treatment-plan-loader.component';

describe('RiskTreatmentPlanLoaderComponent', () => {
  let component: RiskTreatmentPlanLoaderComponent;
  let fixture: ComponentFixture<RiskTreatmentPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
