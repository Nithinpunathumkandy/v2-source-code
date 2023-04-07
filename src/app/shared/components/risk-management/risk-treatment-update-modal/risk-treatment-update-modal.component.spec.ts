import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentUpdateModalComponent } from './risk-treatment-update-modal.component';

describe('RiskTreatmentUpdateModalComponent', () => {
  let component: RiskTreatmentUpdateModalComponent;
  let fixture: ComponentFixture<RiskTreatmentUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
