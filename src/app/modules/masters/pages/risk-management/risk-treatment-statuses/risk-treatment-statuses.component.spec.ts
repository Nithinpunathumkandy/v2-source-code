import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentStatusesComponent } from './risk-treatment-statuses.component';

describe('RiskTreatmentStatusesComponent', () => {
  let component: RiskTreatmentStatusesComponent;
  let fixture: ComponentFixture<RiskTreatmentStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
