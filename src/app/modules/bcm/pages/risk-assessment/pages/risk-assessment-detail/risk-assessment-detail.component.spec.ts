import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentDetailComponent } from './risk-assessment-detail.component';

describe('RiskAssessmentDetailComponent', () => {
  let component: RiskAssessmentDetailComponent;
  let fixture: ComponentFixture<RiskAssessmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssessmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
