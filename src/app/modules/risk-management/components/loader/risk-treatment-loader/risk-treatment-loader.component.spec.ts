import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentLoaderComponent } from './risk-treatment-loader.component';

describe('RiskTreatmentLoaderComponent', () => {
  let component: RiskTreatmentLoaderComponent;
  let fixture: ComponentFixture<RiskTreatmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskTreatmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
