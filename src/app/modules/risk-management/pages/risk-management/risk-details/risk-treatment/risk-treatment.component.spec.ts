import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTreatmentComponent } from './risk-treatment.component';

describe('RiskTreatmentComponent', () => {
  let component: RiskTreatmentComponent;
  let fixture: ComponentFixture<RiskTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
