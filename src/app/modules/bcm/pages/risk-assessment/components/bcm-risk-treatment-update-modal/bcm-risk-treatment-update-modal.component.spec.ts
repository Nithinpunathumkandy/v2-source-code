import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskTreatmentUpdateModalComponent } from './bcm-risk-treatment-update-modal.component';

describe('BcmRiskTreatmentUpdateModalComponent', () => {
  let component: BcmRiskTreatmentUpdateModalComponent;
  let fixture: ComponentFixture<BcmRiskTreatmentUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskTreatmentUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskTreatmentUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
