import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskTreatmentComponent } from './bcm-risk-treatment.component';

describe('BcmRiskTreatmentComponent', () => {
  let component: BcmRiskTreatmentComponent;
  let fixture: ComponentFixture<BcmRiskTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskTreatmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
