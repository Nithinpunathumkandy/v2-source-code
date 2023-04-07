import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskAssessmentModalComponent } from './bcm-risk-assessment-modal.component';

describe('BcmRiskAssessmentModalComponent', () => {
  let component: BcmRiskAssessmentModalComponent;
  let fixture: ComponentFixture<BcmRiskAssessmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskAssessmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskAssessmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
