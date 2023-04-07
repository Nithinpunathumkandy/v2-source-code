import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpRiskAssessmentComponent } from './bcp-risk-assessment.component';

describe('BcpRiskAssessmentComponent', () => {
  let component: BcpRiskAssessmentComponent;
  let fixture: ComponentFixture<BcpRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpRiskAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
