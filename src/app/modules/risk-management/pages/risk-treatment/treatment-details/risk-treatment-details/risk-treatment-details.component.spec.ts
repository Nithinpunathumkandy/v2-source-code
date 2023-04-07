import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentDetailsComponent } from './risk-treatment-details.component';

describe('RiskTreatmentDetailsComponent', () => {
  let component: RiskTreatmentDetailsComponent;
  let fixture: ComponentFixture<RiskTreatmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
