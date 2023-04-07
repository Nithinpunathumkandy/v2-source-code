import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmRiskAssessmentLoaderComponent } from './bcm-risk-assessment-loader.component';

describe('BcmRiskAssessmentLoaderComponent', () => {
  let component: BcmRiskAssessmentLoaderComponent;
  let fixture: ComponentFixture<BcmRiskAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmRiskAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmRiskAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
