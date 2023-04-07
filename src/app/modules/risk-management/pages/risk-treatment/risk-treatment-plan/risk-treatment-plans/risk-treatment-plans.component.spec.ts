import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentPlansComponent } from './risk-treatment-plans.component';

describe('RiskTreatmentPlansComponent', () => {
  let component: RiskTreatmentPlansComponent;
  let fixture: ComponentFixture<RiskTreatmentPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTreatmentPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
