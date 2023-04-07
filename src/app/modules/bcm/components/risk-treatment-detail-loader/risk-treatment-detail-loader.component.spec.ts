import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentDetailLoaderComponent } from './risk-treatment-detail-loader.component';

describe('RiskTreatmentDetailLoaderComponent', () => {
  let component: RiskTreatmentDetailLoaderComponent;
  let fixture: ComponentFixture<RiskTreatmentDetailLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentDetailLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentDetailLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
