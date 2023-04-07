import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskAssessmentComponent } from './bcm-risk-assessment.component';

describe('BcmRiskAssessmentComponent', () => {
  let component: BcmRiskAssessmentComponent;
  let fixture: ComponentFixture<BcmRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
