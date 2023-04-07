import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskAssessmentComponent } from './isms-risk-assessment.component';

describe('IsmsRiskAssessmentComponent', () => {
  let component: IsmsRiskAssessmentComponent;
  let fixture: ComponentFixture<IsmsRiskAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
