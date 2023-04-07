import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskTreatmentDetailsComponent } from './isms-risk-treatment-details.component';

describe('IsmsRiskTreatmentDetailsComponent', () => {
  let component: IsmsRiskTreatmentDetailsComponent;
  let fixture: ComponentFixture<IsmsRiskTreatmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskTreatmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskTreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
