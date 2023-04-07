import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentUpdateComponent } from './risk-treatment-update.component';

describe('RiskTreatmentUpdateComponent', () => {
  let component: RiskTreatmentUpdateComponent;
  let fixture: ComponentFixture<RiskTreatmentUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
