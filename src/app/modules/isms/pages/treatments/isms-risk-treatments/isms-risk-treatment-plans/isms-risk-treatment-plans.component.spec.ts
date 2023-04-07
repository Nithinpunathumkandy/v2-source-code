import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentPlansComponent } from './isms-risk-treatment-plans.component';

describe('IsmsRiskTreatmentPlansComponent', () => {
  let component: IsmsRiskTreatmentPlansComponent;
  let fixture: ComponentFixture<IsmsRiskTreatmentPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskTreatmentPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskTreatmentPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
